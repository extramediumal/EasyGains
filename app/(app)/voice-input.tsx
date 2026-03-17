import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '../../src/lib/supabase';
import { ClarifyingOptions } from '../../src/components/ClarifyingOptions';
import { ParsedFoodList } from '../../src/components/ParsedFoodList';
import { ParsedWorkoutList } from '../../src/components/ParsedWorkoutList';
import { Button } from '../../src/components/Button';
import { WorkoutType } from '../../src/types/database';
import { Colors, Radii } from '../../src/lib/theme';
import { useSubscription } from '../../src/providers/SubscriptionProvider';
import { useDailyEntryCount } from '../../src/hooks/useDailyEntryCount';

function MicIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="white">
      <Path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
      <Path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </Svg>
  );
}

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
  'walked', 'walking', 'hiked', 'hiking', 'hike',
  'lifted', 'lifting', 'deadlift', 'squat', 'bench press',
  'workout', 'worked out', 'exercise', 'exercised', 'training', 'trained',
  'swim', 'swam', 'swimming', 'biked', 'biking', 'cycling',
  'yoga', 'stretching', 'stretched',
  'push up', 'push-up', 'pushup', 'pull up', 'pull-up', 'pullup', 'plank',
  'cardio', 'hiit', 'crossfit',
  'basketball', 'soccer', 'tennis', 'volleyball', 'boxing', 'kickboxing',
  'sprinted', 'sprint', 'laps',
  'reps', 'sets', 'dumbbell', 'barbell', 'kettlebell',
  'gym', 'weights', 'weight training', 'weight lifting', 'weightlifting',
  'miles', 'mile', 'steps', 'class', 'spin', 'pilates', 'zumba',
  'abs', 'core', 'arms', 'legs', 'chest', 'back day', 'leg day',
  'treadmill', 'elliptical', 'rowing', 'row',
  'circuit', 'interval', 'zone 2',
];

const FOOD_KEYWORDS = [
  'ate', 'eat', 'eating', 'drank', 'drink', 'drinking',
  'chicken', 'beef', 'steak', 'fish', 'salmon', 'shrimp', 'pork',
  'rice', 'pasta', 'bread', 'sandwich', 'burger', 'pizza', 'taco',
  'salad', 'soup', 'egg', 'eggs', 'oatmeal', 'cereal',
  'apple', 'banana', 'orange', 'fruit', 'vegetables', 'veggies',
  'protein shake', 'smoothie', 'coffee', 'juice', 'milk',
  'yogurt', 'cheese', 'avocado', 'toast', 'bagel', 'pancake',
  'fries', 'chips', 'cookie', 'cake', 'chocolate', 'ice cream',
];

function matchesKeyword(text: string, keyword: string): boolean {
  if (keyword.includes(' ') || keyword.includes('-')) {
    return text.includes(keyword);
  }
  return new RegExp(`\\b${keyword}\\b`).test(text);
}

function detectInputType(text: string): 'food' | 'workout' | 'both' {
  const lower = text.toLowerCase();
  const hasFood = FOOD_KEYWORDS.some((kw) => matchesKeyword(lower, kw));
  const hasWorkout = WORKOUT_KEYWORDS.some((kw) => matchesKeyword(lower, kw));

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

const FREE_DAILY_LIMIT = 3;

export default function VoiceInputScreen() {
  const { isPro } = useSubscription();
  const { fetchCount } = useDailyEntryCount();
  const [transcript, setTranscript] = useState('');
  const transcriptRef = useRef('');
  const confirmedRef = useRef('');
  const parsingRef = useRef(false);
  const [state, setState] = useState<ParseState>({ status: 'idle' });
  const [foodContext, setFoodContext] = useState<Array<{ role: string; content: string }>>([]);
  const [workoutContext, setWorkoutContext] = useState<Array<{ role: string; content: string }>>([]);
  const [clarifyListening, setClarifyListening] = useState(false);

  const pendingBothRef = useRef<{
    foods?: FoodItem[];
    workout?: { workout_type: WorkoutType; exercises: ExerciseItem[] };
    pendingWorkoutClarification?: { question: string; options: string[] };
  } | null>(null);

  useSpeechRecognitionEvent('result', (event) => {
    const current = event.results[0]?.transcript || '';

    if (event.isFinal) {
      confirmedRef.current = (confirmedRef.current + ' ' + current).trim();
      const full = confirmedRef.current;
      setTranscript(full);
      transcriptRef.current = full;
    } else {
      const full = (confirmedRef.current + ' ' + current).trim();
      setTranscript(full);
      transcriptRef.current = full;
    }
  });

  useSpeechRecognitionEvent('end', () => {
    if (transcriptRef.current && !parsingRef.current) {
      parsingRef.current = true;
      handleParse(transcriptRef.current);
    } else if (!transcriptRef.current && !parsingRef.current) {
      setState({ status: 'idle' });
    }
  });

  async function startListening() {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) return;

    setState({ status: 'listening' });
    setTranscript('');
    transcriptRef.current = '';
    confirmedRef.current = '';
    parsingRef.current = false;
    setFoodContext([]);
    setWorkoutContext([]);
    pendingBothRef.current = null;
    ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: true, continuous: true });
  }

  function stopListening() {
    ExpoSpeechRecognitionModule.stop();
    if (transcriptRef.current && !parsingRef.current) {
      parsingRef.current = true;
      handleParse(transcriptRef.current);
    } else if (!transcriptRef.current) {
      setState({ status: 'idle' });
    }
  }

  async function handleParse(text: string) {
    setState({ status: 'processing' });

    if (!isPro) {
      const todayCount = await fetchCount();
      if (todayCount !== null && todayCount >= FREE_DAILY_LIMIT) {
        router.push('/(app)/paywall');
        setState({ status: 'idle' });
        return;
      }
    }

    const inputType = detectInputType(text);

    try {
      if (inputType === 'both') {
        const { data: { session } } = await supabase.auth.getSession();
        const authHeaders = session ? { Authorization: `Bearer ${session.access_token}` } : {};
        const [foodResult, workoutResult] = await Promise.all([
          supabase.functions.invoke('parse-food', { body: { text }, headers: authHeaders }),
          supabase.functions.invoke('parse-workout', { body: { text }, headers: authHeaders }),
        ]);

        const foodOk = !foodResult.error && foodResult.data?.type === 'meal';
        const workoutOk = !workoutResult.error && workoutResult.data?.type === 'workout';
        const foodClarify = !foodResult.error && foodResult.data?.type === 'clarification';
        const workoutClarify = !workoutResult.error && workoutResult.data?.type === 'clarification';

        if (foodOk && workoutOk) {
          setState({
            status: 'parsed_both',
            foods: foodResult.data.foods,
            workout_type: workoutResult.data.workout_type,
            exercises: workoutResult.data.exercises,
          });
        } else if (foodClarify) {
          if (workoutOk) {
            pendingBothRef.current = { workout: { workout_type: workoutResult.data.workout_type, exercises: workoutResult.data.exercises } };
          } else if (workoutClarify) {
            pendingBothRef.current = { pendingWorkoutClarification: { question: workoutResult.data.question, options: workoutResult.data.options || [] } };
            setWorkoutContext([{ role: 'user', content: text }]);
          }
          setFoodContext([{ role: 'user', content: text }]);
          setState({
            status: 'clarifying',
            inputType: 'food',
            question: foodResult.data.question,
            options: foodResult.data.options || [],
          });
        } else if (workoutClarify) {
          if (foodOk) {
            pendingBothRef.current = { foods: foodResult.data.foods };
          }
          setWorkoutContext([{ role: 'user', content: text }]);
          setState({
            status: 'clarifying',
            inputType: 'workout',
            question: workoutResult.data.question,
            options: workoutResult.data.options || [],
          });
        } else if (foodOk) {
          setState({ status: 'parsed_food', foods: foodResult.data.foods });
        } else if (workoutOk) {
          setState({ status: 'parsed_workout', workout_type: workoutResult.data.workout_type, exercises: workoutResult.data.exercises });
        } else {
          throw new Error('Both parsers failed');
        }
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
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('parse-food', {
        body: { text, context: currentContext.length > 0 ? currentContext : undefined },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
      });

      if (error) throw error;

      if (data.type === 'clarification') {
        // If Claude thinks this is a workout, silently re-route instead of showing a confusing clarification
        const q = (data.question || '').toLowerCase();
        const looksLikeWorkoutMismatch = ['workout', 'exercise', 'run', 'lift', 'training', 'activity'].some(w => q.includes(w));
        if (looksLikeWorkoutMismatch) {
          return parseWorkout(text);
        }
        setFoodContext([...currentContext, { role: 'user', content: text }]);
        setState({
          status: 'clarifying',
          inputType: 'food',
          question: data.question,
          options: data.options || [],
        });
      } else if (data.type === 'meal') {
        const pending = pendingBothRef.current;
        if (pending?.workout) {
          pendingBothRef.current = null;
          setState({
            status: 'parsed_both',
            foods: data.foods,
            workout_type: pending.workout.workout_type,
            exercises: pending.workout.exercises,
          });
        } else if (pending?.pendingWorkoutClarification) {
          pendingBothRef.current = { foods: data.foods };
          setState({
            status: 'clarifying',
            inputType: 'workout',
            question: pending.pendingWorkoutClarification.question,
            options: pending.pendingWorkoutClarification.options,
          });
        } else {
          setState({ status: 'parsed_food', foods: data.foods });
        }
      }
    } catch (err) {
      setState({ status: 'error', message: 'Failed to parse food. Try again.' });
    }
  }

  async function parseWorkout(text: string, ctx?: Array<{ role: string; content: string }>) {
    const currentContext = ctx || workoutContext;
    setState({ status: 'processing' });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('parse-workout', {
        body: { text, context: currentContext.length > 0 ? currentContext : undefined },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
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
        const pending = pendingBothRef.current;
        if (pending?.foods) {
          pendingBothRef.current = null;
          setState({
            status: 'parsed_both',
            foods: pending.foods,
            workout_type: data.workout_type,
            exercises: data.exercises,
          });
        } else {
          setState({ status: 'parsed_workout', workout_type: data.workout_type, exercises: data.exercises });
        }
      }
    } catch (err) {
      setState({ status: 'error', message: 'Failed to parse workout. Try again.' });
    }
  }

  async function handleClarificationSelect(option: string) {
    if (state.status !== 'clarifying') return;
    setClarifyListening(false);

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

  async function startClarifyListening() {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) return;
    setClarifyListening(true);
    transcriptRef.current = '';
    confirmedRef.current = '';
    ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: true, continuous: true });
  }

  function stopClarifyListening() {
    ExpoSpeechRecognitionModule.stop();
    setClarifyListening(false);
    if (transcriptRef.current) {
      handleClarificationSelect(transcriptRef.current);
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

    const sums = exercises.reduce(
      (acc, e) => ({
        effort_score: acc.effort_score + e.effort_score,
        duration_min: acc.duration_min + e.duration_min,
        calories_burned: acc.calories_burned + e.calories_burned,
      }),
      { effort_score: 0, duration_min: 0, calories_burned: 0 }
    );

    // Effort is session intensity (1-10), not cumulative — average across exercises
    const avgEffort = Math.round(sums.effort_score / exercises.length);

    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: session.user.id,
        workout_type: workoutType,
        raw_input: transcript,
        total_effort_score: avgEffort,
        total_duration_min: sums.duration_min,
        total_calories_burned: sums.calories_burned,
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
      <View style={styles.close}>
        <Button title="Cancel" onPress={goBack} variant="secondary" />
      </View>

      {state.status === 'idle' && (
        <View style={styles.center}>
          <Text style={styles.prompt}>What did you eat or do?</Text>
          <TouchableOpacity style={styles.micButton} onPress={startListening}>
            <MicIcon />
          </TouchableOpacity>
          <Text style={styles.hint}>Tap to speak</Text>
        </View>
      )}

      {state.status === 'listening' && (
        <View style={styles.center}>
          <Text style={styles.prompt}>Listening...</Text>
          <TouchableOpacity style={[styles.micButton, styles.micActive]} onPress={stopListening}>
            <MicIcon />
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
        <ScrollView contentContainerStyle={styles.clarifyContainer}>
          <Text style={styles.clarifyQuestion}>{state.question}</Text>

          {state.options.length > 0 && (
            <ClarifyingOptions
              question=""
              options={state.options}
              onSelect={handleClarificationSelect}
            />
          )}


          <View style={styles.clarifyMicSection}>
            <Text style={styles.clarifyOrText}>
              {state.options.length > 0 ? 'or speak your answer' : 'Tap to answer'}
            </Text>
            <TouchableOpacity
              style={[styles.micButton, clarifyListening && styles.micActive]}
              onPress={clarifyListening ? stopClarifyListening : startClarifyListening}
            >
              <MicIcon />
            </TouchableOpacity>
            {clarifyListening && (
              <Text style={styles.hint}>Listening... tap to send</Text>
            )}
            {clarifyListening && transcript ? (
              <Text style={styles.transcript}>{transcript}</Text>
            ) : null}
          </View>
        </ScrollView>
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

          <View style={styles.confirmContainer}>
            <Button title="Log it" onPress={handleConfirm} variant="primary" />
          </View>
        </ScrollView>
      )}

      {state.status === 'error' && (
        <View style={styles.center}>
          <Text style={styles.error}>{state.message}</Text>
          <TouchableOpacity style={styles.micButton} onPress={startListening}>
            <MicIcon />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 60 },
  close: { position: 'absolute', top: 60, left: 24, zIndex: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  prompt: { fontSize: 24, fontWeight: '600', marginBottom: 32 },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micActive: { backgroundColor: Colors.destructive },
  hint: { marginTop: 16, color: Colors.textMuted },
  transcript: { fontSize: 16, color: '#333', padding: 24, textAlign: 'center' },
  processingText: { marginTop: 16, color: Colors.textSecondary },
  resultContainer: { flex: 1, paddingTop: 60 },
  sectionTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 24, marginTop: 8 },
  confirmContainer: { margin: 24 },
  error: { color: Colors.destructive, fontSize: 16, marginBottom: 24 },
  clarifyContainer: { alignItems: 'center', padding: 24, paddingTop: 80 },
  clarifyQuestion: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 24 },
  clarifyMicSection: { alignItems: 'center', marginTop: 32 },
  clarifyOrText: { textAlign: 'center', color: Colors.textMuted, fontSize: 14, marginBottom: 16 },
});
