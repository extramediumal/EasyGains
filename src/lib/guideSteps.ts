export interface GuideStep {
  id: number;
  screen: 'onboarding' | 'home';
  message: string;
  buttonText: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 0,
    screen: 'onboarding',
    message: "Welcome to EasyGains. Eat your protein, move your body, don't overthink the rest.",
    buttonText: 'Got it',
  },
  {
    id: 1,
    screen: 'onboarding',
    message: 'Just talk to us. Say what you ate or what workout you did. We figure out the rest.',
    buttonText: 'Cool',
  },
  {
    id: 2,
    screen: 'home',
    message: 'Tap the mic and say what you ate. That\'s it.',
    buttonText: 'Next',
  },
  {
    id: 3,
    screen: 'home',
    message: 'These rings fill up as you log your meals. Track your calories and macros at a glance.',
    buttonText: 'Next',
  },
  {
    id: 4,
    screen: 'home',
    message: 'Head to Settings to dial in your goals and ideal weight. Everything adjusts to you.',
    buttonText: 'Take me there',
  },
];
