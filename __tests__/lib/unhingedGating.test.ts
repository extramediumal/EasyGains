import {
  checkSubmissionCount,
  UNHINGED_THRESHOLD,
  PROTECTOR_QUESTIONS,
  validateProtectorAnswers,
  validatePassphrase,
  DENIAL_MESSAGES,
} from '../../src/lib/unhingedGating';

describe('checkSubmissionCount', () => {
  it('returns false below threshold', () => {
    expect(checkSubmissionCount(99)).toBe(false);
  });
  it('returns true at threshold', () => {
    expect(checkSubmissionCount(100)).toBe(true);
  });
  it('returns true above threshold', () => {
    expect(checkSubmissionCount(250)).toBe(true);
  });
});

describe('validateProtectorAnswers', () => {
  it('returns true when all answers are correct', () => {
    const answers = PROTECTOR_QUESTIONS.map((q) => q.correctAnswer);
    expect(validateProtectorAnswers(answers)).toBe(true);
  });
  it('returns false when any answer is wrong', () => {
    const answers = PROTECTOR_QUESTIONS.map((q) => q.correctAnswer);
    answers[0] = 'wrong';
    expect(validateProtectorAnswers(answers)).toBe(false);
  });
});

describe('validatePassphrase', () => {
  it('returns true for correct passphrase (case insensitive)', () => {
    expect(validatePassphrase('GAINS OVER FEELINGS')).toBe(true);
    expect(validatePassphrase('gains over feelings')).toBe(true);
  });
  it('returns false for wrong passphrase', () => {
    expect(validatePassphrase('hello world')).toBe(false);
  });
});

describe('DENIAL_MESSAGES', () => {
  it('has at least 3 messages', () => {
    expect(DENIAL_MESSAGES.length).toBeGreaterThanOrEqual(3);
  });
});
