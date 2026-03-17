import { GUIDE_STEPS } from '../../src/lib/guideSteps';

describe('New User Guide', () => {
  it('has exactly 5 steps', () => {
    expect(GUIDE_STEPS.length).toBe(5);
  });

  it('has 2 onboarding steps and 3 home steps', () => {
    const onboarding = GUIDE_STEPS.filter(s => s.screen === 'onboarding');
    const home = GUIDE_STEPS.filter(s => s.screen === 'home');
    expect(onboarding.length).toBe(2);
    expect(home.length).toBe(3);
  });

  it('steps are in sequential order', () => {
    GUIDE_STEPS.forEach((step, i) => {
      expect(step.id).toBe(i);
    });
  });

  it('onboarding steps come before home steps', () => {
    const lastOnboarding = Math.max(...GUIDE_STEPS.filter(s => s.screen === 'onboarding').map(s => s.id));
    const firstHome = Math.min(...GUIDE_STEPS.filter(s => s.screen === 'home').map(s => s.id));
    expect(lastOnboarding).toBeLessThan(firstHome);
  });

  it('last step button says "Take me there"', () => {
    const lastStep = GUIDE_STEPS[GUIDE_STEPS.length - 1];
    expect(lastStep.buttonText).toBe('Take me there');
  });

  it('all steps have non-empty messages', () => {
    GUIDE_STEPS.forEach((step) => {
      expect(step.message.length).toBeGreaterThan(10);
      expect(step.buttonText.length).toBeGreaterThan(0);
    });
  });
});
