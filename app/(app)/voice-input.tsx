import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { supabase } from '../../src/lib/supabase';
import { ClarifyingOptions } from '../../src/components/ClarifyingOptions';
import { ParsedFoodList } from '../../src/components/ParsedFoodList';
import { ParsedWorkoutList } from '../../src/components/ParsedWorkoutList';
import { WorkoutType } from '../../src/types/database';

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

interface ExerciseItem {
  name: string;
  detail: string;
  duration_min: number;
  calories_burned: number;
  effort_score: number;
}

const WORKOUT_KEYWORDS = [
  'ran', 'run', 'running', 'jog', 'jogged', 'jogging',
  'walk', 'walked', 'walking', 'hiked', 'hiking', 'hike',
  'lifted', 'lifting', 'deadlift', 'squat', 'bench', 'press',
  'workout', 'worked out', 'exercise', 'exercised', 'training', 'trained',
  'swim', 'swam', 'swimming', 'biked', 'biking', 'cycling', 'rode',
  'yoga', 'stretching', 'stretched', 'pushup', 'pullup', 'plank',
  'cardio', 'hiit', 'crossfit', 'gym', 'basketball', 'soccer', 'tennis',
  'football', 'volleyball', 'boxing', 'kickboxing', 'martial arts',
  'jumping', 'jumped', 'sprinted', 'sprint', 'mile', 'miles', 'laps',
  'reps', 'sets', 'weights', 'dumbbell', 'barbell', 'kettlebell',
];

const FOOD_KEYWORDS = [
  'ate', 'eat', 'eating', 'had', 'drank', 'drink', 'drinking',
  'breakfast', 'lunch', 'dinner', 'snack', 'meal',
  'chicken', 'beef', 'steak', 'fish', 'salmon', 'shrimp', 'pork',
  'rice', 'pasta', 'bread', 'sandwich', 'burger', 'pizza', 'taco',
  'salad', 'soup', 'egg', 'eggs', 'oatmeal', 'cereal',
  'apple', 'banana', 'orange', 'fruit', 'vegetables', 'veggies',
  'protein shake', 'smoothie', 'coffee', 'juice', 'milk', 'water',
  'yogurt', 'cheese', 'avocado', 'toast', 'bagel', 'pancake',
  'fries', 'chips', 'cookie', 'cake', 'chocolate', 'ice cream',
];

function detectInputType(text: string): 'food' | 'workout' | 'both' {
  const lower = text.toLowerCase();
  const hasFood = FOOD_KEYWORDS.some((kw) => lower.includes(kw));
  const hasWorkout = WORKOUT_KEYWORDS.some((kw) => lower.includes(kw));

  if (hasFood && hasWorkout) return 'both';
  if (hasWorkout) return 'workout';
  return 'food';
}

type ParseState =
  | { status: 'idle' }
  | { status: 'listening' }
  | { status: 'processing' }
  | { status: 'clarifying'; inputType: 'food' | 'workout'; question: string; options: string[] }
  | { status: 'parsed_food'; foods: FoodItem[] }
  | { status: 'parsed_workout'; workout_type: WorkoutType; exercises: ExerciseItem[] }
  | { status: 'parsed_both'; foods: FoodItem[]; workout_type: WorkoutType; exercises: ExerciseItem[] }
  | { status: 'error'; message: string };

export default function VoiceInputScreen() {
  const [transcript, setTranscript] = useState('');
  const [state, setState] = useState<ParseState>({ status: 'idle' });
  const [foodContext, setFoodContext] = useState<Array<{ role: string; content: string }>>([]);
  const [workoutContext, setWorkoutContext] = useState<Array<{ role: string; content: string }>>([]);

  useSpeechRecognitionEvent('result', (event) => {
    setTranscript(event.results[0]?.transcript || '');
  });

  useSpeechRecognitionEvent('end', () => {
    if (transcript) {
      handleParse(transcript);
    }
  });

  async function startListening() {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) return;

    setState({ status: 'listening' });
    setTranscript('');
    setFoodContext([]);
    setWorkoutContext([]);
    ExpoSpeechRecognitionModule.start({ lang: 'en-US' });
  }

  function stopListening() {
    ExpoSpeechRecognitionModule.stop();
  }

  async function handleParse(text: string) {
    setState({ status: 'processing' });
    const inputType = detectInputType(text);

    try {
      if (inputType === 'both') {
        const [foodResult, workoutResult] = await Promise.all([
          supabase.functions.invoke('parse-food', { body: { text } }),
          supabase.functions.invoke('parse-workout', { body: { text } }),
        ]);

        if (foodResult.error) throw foodResult.error;
        if (workoutResult.error) throw workoutResult.error;

        // If either needs clarification, handle food first
        if (foodResult.data.type === 'clarification') {
          setFoodContext([{ role: 'user', content: text }]);
          setState({
            status: 'clarifying',
            inputType: 'food',
            question: foodResult.data.question,
            options: foodResult.data.options || [],
          });
          return;
        }
        if (workoutResult.data.type === 'clarification') {
          setWorkoutContext([{ role: 'user', content: text }]);
          setState({
            status: 'clarifying',
            inputType: 'workout',
            question: workoutResult.data.question,
            options: workoutResult.data.options || [],
          });
          return;
        }

        setState({
          status: 'parsed_both',
          foods: foodResult.data.foods,
          workout_type: workoutResult.data.workout_type,
          exercises: workoutResult.data.exercises,
        });
      } else if (inputType === 'workout') {
        await parseWorkout(text);
      } else {
        await parseFood(text);
      }
    } catch (err) {
      setState({ status: 'error', message: 'Failed to parse. Try again.' });
    }
  }

  async function parseFood(text: string, ctx?: Array<{ role: string; content: string }>) {
    const currentContext = ctx || foodContext;
    setState({ status: 'processing' });
    try {
      const { data, error } = await supabase.functions.invoke('parse-food', {
        body: { text, context: currentContext.length > 0 ? currentContext : undefined },
      });

      if (error) throw error;

      if (data.type === 'clarification') {
        setFoodContext([...currentContext, { role: 'user', content: text }]);
        setState({
          status: 'clarifying',
          inputType: 'food',
          question: data.question,
          options: data.options || [],
        });
      } else if (data.type === 'meal') {
        setState({ status: 'parsed_food', foods: data.foods });
      }
    } catch (err) {
      setState({ status: 'error', message: 'Failed to parse food. Try again.' });
    }
  }

  async function parseWorkout(text: string, ctx?: Array<{ role: string; content: string }>) {
    const currentContext = ctx || workoutContext;
    setState({ status: 'processing' });
    try {
      const { data, error } = await supabase.functions.invoke('parse-workout', {
        body: { text, context: currentContext.length > 0 ? currentContext : undefined },
      });

      if (error) throw error;

      if (data.type === 'clarification') {
        setWorkoutContext([...currentContext, { role: 'user', content: text }]);
        setState({
          status: 'clarifying',
          inputType: 'workout',
          question: data.question,
          options: data.options || [],
        });
      } else if (data.type === 'workout') {
        setState({ status: 'parsed_workout', workout_type: data.workout_type, exercises: data.exercises });
      }
    } catch (err) {
      setState({ status: 'error', message: 'Failed to parse workout. Try again.' });
    }
  }

  async function handleClarificationSelect(option: string) {
    if (state.status !== 'clarifying') return;

    if (state.inputType === 'food') {
      const updatedContext = [...foodContext, { role: 'assistant', content: JSON.stringify(state) }];
      setFoodContext(updatedContext);
      parseFood(option, updatedContext);
    } else {
      const updatedContext = [...workoutContext, { role: 'assistant', content: JSON.stringify(state) }];
      setWorkoutContext(updatedContext);
      parseWorkout(option, updatedContext);
    }
  }

  async function handleConfirmFood(foods: FoodItem[]) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const totals = foods.reduce(
      (acc, f) => ({
        calories: acc.calories + f.calories,
        protein: acc.protein + f.protein,
        carbs: acc.carbs + f.carbs,
        fat: acc.fat + f.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .insert({
        user_id: session.user.id,
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

    await supabase.from('meal_items').insert(
      foods.map((f) => ({ meal_id: meal.id, ...f }))
    );
  }

  async function handleConfirmWorkout(workoutType: WorkoutType, exercises: ExerciseItem[]) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const totals = exercises.reduce(
      (acc, e) => ({
        effort_score: acc.effort_score + e.effort_score,
        duration_min: acc.duration_min + e.duration_min,
        calories_burned: acc.calories_burned + e.calories_burned,
      }),
      { effort_score: 0, duration_min: 0, calories_burned: 0 }
    );

    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: session.user.id,
        workout_type: workoutType,
        raw_input: transcript,
        total_effort_score: totals.effort_score,
        total_duration_min: totals.duration_min,
        total_calories_burned: totals.calories_burned,
      })
      .select()
      .single();

    if (workoutError || !workout) return;

    await supabase.from('workout_exercises').insert(
      exercises.map((e) => ({ workout_id: workout.id, ...e }))
    );
  }

  async function handleConfirm() {
    if (state.status === 'parsed_food') {
      await handleConfirmFood(state.foods);
    } else if (state.status === 'parsed_workout') {
      await handleConfirmWorkout(state.workout_type, state.exercises);
    } else if (state.status === 'parsed_both') {
      await Promise.all([
        handleConfirmFood(state.foods),
        handleConfirmWorkout(state.workout_type, state.exercises),
      ]);
    }
    goBack();
  }

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/(tabs)');
    }
  }

  const showResults = state.status === 'parsed_food' || state.status === 'parsed_workout' || state.status === 'parsed_both';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={goBack}>
        <Text style={styles.closeText}>Cancel</Text>
      </TouchableOpacity>

      {state.status === 'idle' && (
        <View style={styles.center}>
          <Text style={styles.prompt}>What did you eat or do?</Text>
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

      {showResults && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.transcript}>{transcript}</Text>

          {(state.status === 'parsed_food' || state.status === 'parsed_both') && (
            <View>
              {state.status === 'parsed_both' && (
                <Text style={styles.sectionTitle}>Food</Text>
              )}
              <ParsedFoodList foods={state.foods} />
            </View>
          )}

          {(state.status === 'parsed_workout' || state.status === 'parsed_both') && (
            <View>
              {state.status === 'parsed_both' && (
                <Text style={styles.sectionTitle}>Movement</Text>
              )}
              <ParsedWorkoutList exercises={state.exercises} />
            </View>
          )}

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Log it</Text>
          </TouchableOpacity>
        </ScrollView>
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
  sectionTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 24, marginTop: 8 },
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
