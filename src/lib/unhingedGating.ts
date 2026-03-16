export const UNHINGED_THRESHOLD = 100;

export const PASSPHRASE = 'gains over feelings';

export interface ProtectorQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const PROTECTOR_QUESTIONS: ProtectorQuestion[] = [
  {
    question: 'Do you hate yourself?',
    options: ['Yes, absolutely', 'No, I love myself'],
    correctAnswer: 'Yes, absolutely',
  },
  {
    question: "If someone says 'fuck you,' do you get offended?",
    options: ["Yes, that's rude", 'Nah, I can take it'],
    correctAnswer: 'Nah, I can take it',
  },
  {
    question: 'Can you handle being roasted about your food choices?',
    options: ['Bring it on', "I'd rather not"],
    correctAnswer: 'Bring it on',
  },
];

export const DENIAL_MESSAGES = [
  'You are not ready, young grasshopper.',
  'You must prove yourself.',
  "Come back when you've toughened up.",
  'The unhinged path is not for the faint of heart.',
  'Maybe try a meditation app instead.',
];

export function checkSubmissionCount(count: number): boolean {
  return count >= UNHINGED_THRESHOLD;
}

export function validateProtectorAnswers(answers: string[]): boolean {
  if (answers.length !== PROTECTOR_QUESTIONS.length) return false;
  return PROTECTOR_QUESTIONS.every((q, i) => answers[i] === q.correctAnswer);
}

export function validatePassphrase(input: string): boolean {
  return input.toLowerCase().trim() === PASSPHRASE;
}

export function getRandomDenialMessage(): string {
  return DENIAL_MESSAGES[Math.floor(Math.random() * DENIAL_MESSAGES.length)];
}
