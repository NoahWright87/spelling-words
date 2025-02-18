export class SpellingWordPerformance {
  word: string;
  currentAttempts: number;
  correctSpellings: number;
  currentStreak: number;
  isMastered: boolean;
  totalAttempts: number;
  totalCorrect: number;
  bestStreak: number;

  constructor(word: string) {
    this.word = word;
    this.currentAttempts = 0;
    this.correctSpellings = 0;
    this.currentStreak = 0;
    this.isMastered = false;
    this.totalAttempts = 0;
    this.totalCorrect = 0;
    this.bestStreak = 0;
  }

  getCurrentCorrectPercentage(): number {
    return this.currentAttempts > 0 ? (this.correctSpellings / this.currentAttempts) * 100 : 0;
  }

  getTotalCorrectPercentage(): number {
    return this.totalAttempts > 0 ? (this.totalCorrect / this.totalAttempts) * 100 : 0;
  }
}