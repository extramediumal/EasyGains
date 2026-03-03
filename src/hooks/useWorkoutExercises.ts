import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { WorkoutExercise } from '../types/database';

export function useWorkoutExercises(workoutId: string) {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExercises = useCallback(async () => {
    const { data } = await supabase
      .from('workout_exercises')
      .select('*')
      .eq('workout_id', workoutId);

    setExercises(data || []);
    setLoading(false);
  }, [workoutId]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  async function deleteExercise(exerciseId: string) {
    await supabase.from('workout_exercises').delete().eq('id', exerciseId);
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
  }

  return { exercises, loading, refetch: fetchExercises, deleteExercise };
}
