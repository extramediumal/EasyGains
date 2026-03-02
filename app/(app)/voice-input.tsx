import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { supabase } from '../../src/lib/supabase';
import { ClarifyingOptions } from '../../src/components/ClarifyingOptions';
import { ParsedFoodList } from '../../src/components/ParsedFoodList';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

function guessMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour < 21) return 'dinner';
  return 'snack';
}

interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

type ParseState =
  | { status: 'idle' }
  | { status: 'listening' }
  | { status: 'processing' }
  | { status: 'clarifying'; question: string; options: string[] }
  | { status: 'parsed'; foods: FoodItem[] }
  | { status: 'error'; message: string };

export default function VoiceInputScreen() {
  const [transcript, setTranscript] = useState('');
  const [state, setState] = useState<ParseState>({ status: 'idle' });
  const [context, setContext] = useState<Array<{ role: string; content: string }>>([]);

  useSpeechRecognitionEvent('result', (event) => {
    setTranscript(event.results[0]?.transcript || '');
  });

  useSpeechRecognitionEvent('end', () => {
    if (transcript) {
      parseFood(transcript);
    }
  });

  async function startListening() {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) return;

    setState({ status: 'listening' });
    setTranscript('');
    ExpoSpeechRecognitionModule.start({ lang: 'en-US' });
  }

  function stopListening() {
    ExpoSpeechRecognitionModule.stop();
  }

  async function parseFood(text: string) {
    setState({ status: 'processing' });
    try {
      const { data, error } = await supabase.functions.invoke('parse-food', {
        body: { text, context: context.length > 0 ? context : undefined },
      });

      if (error) throw error;

      if (data.type === 'clarification') {
        setContext([...context, { role: 'user', content: text }]);
        setState({
          status: 'clarifying',
          question: data.question,
          options: data.options,
        });
      } else if (data.type === 'meal') {
        setState({ status: 'parsed', foods: data.foods });
      }
    } catch (err) {
      setState({ status: 'error', message: 'Failed to parse food. Try again.' });
    }
  }

  async function handleClarificationSelect(option: string) {
    const updatedContext = [...context, { role: 'assistant', content: JSON.stringify(state) }];
    setContext(updatedContext);
    parseFood(option);
  }

  async function handleConfirm() {
    if (state.status !== 'parsed') return;

    const foods = state.foods;
    const totals = foods.reduce(
      (acc, f) => ({
        calories: acc.calories + f.calories,
        protein: acc.protein + f.protein,
        carbs: acc.carbs + f.carbs,
        fat: acc.fat + f.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Create meal
    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .insert({
        meal_type: guessMealType(),
        raw_input: transcript,
        total_calories: totals.calories,
        total_protein: totals.protein,
        total_carbs: totals.carbs,
        total_fat: totals.fat,
      })
      .select()
      .single();

    if (mealError || !meal) return;

    // Create meal items
    await supabase.from('meal_items').insert(
      foods.map((f) => ({ meal_id: meal.id, ...f }))
    );

    router.back();
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={() => router.back()}>
        <Text style={styles.closeText}>Cancel</Text>
      </TouchableOpacity>

      {state.status === 'idle' && (
        <View style={styles.center}>
          <Text style={styles.prompt}>What did you eat?</Text>
          <TouchableOpacity style={styles.micButton} onPress={startListening}>
            <Text style={styles.micIcon}>🎤</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>Tap to speak</Text>
        </View>
      )}

      {state.status === 'listening' && (
        <View style={styles.center}>
          <Text style={styles.prompt}>Listening...</Text>
          <TouchableOpacity style={[styles.micButton, styles.micActive]} onPress={stopListening}>
            <Text style={styles.micIcon}>🎤</Text>
          </TouchableOpacity>
          {transcript ? <Text style={styles.transcript}>{transcript}</Text> : null}
        </View>
      )}

      {state.status === 'processing' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.processingText}>Crunching the numbers...</Text>
          {transcript ? <Text style={styles.transcript}>{transcript}</Text> : null}
        </View>
      )}

      {state.status === 'clarifying' && (
        <View>
          <Text style={styles.transcript}>{transcript}</Text>
          <ClarifyingOptions
            question={state.question}
            options={state.options}
            onSelect={handleClarificationSelect}
          />
        </View>
      )}

      {state.status === 'parsed' && (
        <View style={styles.resultContainer}>
          <Text style={styles.transcript}>{transcript}</Text>
          <ParsedFoodList foods={state.foods} />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Log it</Text>
          </TouchableOpacity>
        </View>
      )}

      {state.status === 'error' && (
        <View style={styles.center}>
          <Text style={styles.error}>{state.message}</Text>
          <TouchableOpacity style={styles.micButton} onPress={startListening}>
            <Text style={styles.micIcon}>🎤</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  close: { position: 'absolute', top: 60, left: 24, zIndex: 10 },
  closeText: { fontSize: 16, color: '#666' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  prompt: { fontSize: 24, fontWeight: '600', marginBottom: 32 },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micActive: { backgroundColor: '#FF3B30' },
  micIcon: { fontSize: 32 },
  hint: { marginTop: 16, color: '#999' },
  transcript: { fontSize: 16, color: '#333', padding: 24, textAlign: 'center' },
  processingText: { marginTop: 16, color: '#666' },
  resultContainer: { flex: 1 },
  confirmButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    margin: 24,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: '#FF3B30', fontSize: 16, marginBottom: 24 },
});
