// src/hooks/useGuideState.ts
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'easygains_guide_step';
const TOTAL_STEPS = 5;

export function useGuideState() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      setCurrentStep(stored ? parseInt(stored, 10) : 0);
      setLoading(false);
    }
    load();
  }, []);

  const advanceStep = useCallback(async () => {
    const next = currentStep + 1;
    setCurrentStep(next);
    await AsyncStorage.setItem(STORAGE_KEY, String(next));
  }, [currentStep]);

  const isGuideComplete = currentStep >= TOTAL_STEPS;

  return { currentStep, loading, isGuideComplete, advanceStep };
}
