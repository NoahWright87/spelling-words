export class SpellingWordPerformance {
  word: string;
  attempts: number;
  correct: number;
  streak: number;

  constructor(word: string, attempts: number = 0, correct: number = 0, streak: number = 0) {
    this.word = word;
    this.attempts = attempts;
    this.correct = correct;
    this.streak = streak;
  }

  combineWith(other: SpellingWordPerformance) {
    this.attempts += other.attempts;
    this.correct += other.correct;
    if (other.correct === other.attempts) {
      // Combine streaks
      this.streak = this.streak + other.streak;
    } else {
      // Otherwise, go with the larger streak
      this.streak = Math.max(this.streak, other.streak);
    }
  }

  getPercentage(): number {
    return this.attempts > 0 ? (this.correct / this.attempts) * 100 : 0;
  }
}