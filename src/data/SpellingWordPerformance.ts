export class SpellingWordPerformance {
  word: string;
  currentAttempts: number;
  correctSpellings: number;
  currentStreak: number;
  isMastered: boolean;

  constructor(word: string) {
    this.word = word;
    this.currentAttempts = 0;
    this.correctSpellings = 0;
    this.currentStreak = 0;
    this.isMastered = false;
  }
}