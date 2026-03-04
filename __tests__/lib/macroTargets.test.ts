import { computeMacroTargets, getCalorieBudgetStatus } from '../../src/lib/macroTargets';

describe('computeMacroTargets', () => {
  it('computes standard case: 180 lbs / 2000 cal', () => {
    const result = computeMacroTargets(180, 2000);
    expect(result.protein).toBe(180);
    expect(result.fat).toBe(54);
    // (2000 - 180*4 - 54*9) / 4 = (2000 - 720 - 486) / 4 = 198.5 → 199
    expect(result.carbs).toBe(199);
    expect(result.calories).toBe(2000);
  });

  it('clamps fat up when below 20% of calories', () => {
    // 160 lbs, 2500 cal: 160*0.3 = 48g fat, 48*9=432, 432/2500 = 17.3% < 20%
    const result = computeMacroTargets(160, 2500);
    // Should clamp to (2500 * 0.20) / 9 = 55.6 → 56
    expect(result.fat).toBe(56);
    expect(result.protein).toBe(160);
  });

  it('clamps fat down when above 35% of calories', () => {
    // 300 lbs, 1500 cal: 300*0.3 = 90g fat, 90*9=810, 810/1500 = 54% > 35%
    const result = computeMacroTargets(300, 1500);
    // Should clamp to (1500 * 0.35) / 9 = 58.3 → 58
    expect(result.fat).toBe(58);
  });

  it('enforces minimum 50g carbs', () => {
    // 220 lbs, 1200 cal: protein=220*4=880, fat needs to eat most remaining
    const result = computeMacroTargets(220, 1200);
    expect(result.carbs).toBe(50);
  });

  it('handles typical weight loss case: 150 lbs / 1800 cal', () => {
    const result = computeMacroTargets(150, 1800);
    expect(result.protein).toBe(150);
    expect(result.fat).toBe(45);
    // (1800 - 600 - 405) / 4 = 198.75 → 199
    expect(result.carbs).toBe(199);
  });
});

describe('getCalorieBudgetStatus', () => {
  it('returns under when below 90%', () => {
    expect(getCalorieBudgetStatus(1600, 2000)).toBe('under');
  });

  it('returns approaching at exactly 90%', () => {
    expect(getCalorieBudgetStatus(1800, 2000)).toBe('approaching');
  });

  it('returns approaching at 95%', () => {
    expect(getCalorieBudgetStatus(1900, 2000)).toBe('approaching');
  });

  it('returns approaching at exactly 100%', () => {
    expect(getCalorieBudgetStatus(2000, 2000)).toBe('approaching');
  });

  it('returns over when above 100%', () => {
    expect(getCalorieBudgetStatus(2100, 2000)).toBe('over');
  });
});
