// __tests__/hooks/useGuideState.test.ts
import { renderHook, act } from '@testing-library/react-native';
import { useGuideState } from '../../src/hooks/useGuideState';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

describe('useGuideState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('starts at step 0 for new users', async () => {
    const { result } = renderHook(() => useGuideState());
    await act(async () => {});
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isGuideComplete).toBe(false);
  });

  it('advances to next step', async () => {
    const { result } = renderHook(() => useGuideState());
    await act(async () => {});
    await act(async () => { result.current.advanceStep(); });
    expect(result.current.currentStep).toBe(1);
  });

  it('marks guide complete after step 5', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
    const { result } = renderHook(() => useGuideState());
    await act(async () => {});
    expect(result.current.isGuideComplete).toBe(true);
  });

  it('persists step to AsyncStorage', async () => {
    const { result } = renderHook(() => useGuideState());
    await act(async () => {});
    await act(async () => { result.current.advanceStep(); });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('easygains_guide_step', '1');
  });
});
