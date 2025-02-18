import { SpellingWordPerformance } from './SpellingWordPerformance';

export class SpellingWordListPerformance {
  private performances: Map<string, SpellingWordPerformance>;

  constructor() {
    this.performances = new Map();
  }

  combineWith(other: SpellingWordListPerformance) {
    other.performances.forEach((perf, word) => {
      if (!this.performances.has(word)) {
        this.performances.set(word, perf);
      } else {
        const existing = this.performances.get(word);
        if (existing) {
          existing.currentAttempts = perf.currentAttempts;
          existing.correctSpellings = perf.correctSpellings;
          existing.currentStreak = perf.currentStreak;
          existing.isMastered = perf.isMastered;
          existing.totalAttempts += perf.currentAttempts;
          existing.totalCorrect += perf.correctSpellings;
          if (perf.currentStreak > existing.bestStreak) {
            existing.bestStreak = perf.currentStreak;
          }
        }
      }
    });
  }

  addWord(word: string) {
    if (!this.performances.has(word)) {
      this.performances.set(word, new SpellingWordPerformance(word));
    }
  }

  getPerformance(word: string): SpellingWordPerformance | undefined {
    return this.performances.get(word);
  }

  getAverageCurrentCorrectPercentage(): number {
    const total = Array.from(this.performances.values()).reduce((sum, perf) => sum + perf.getCurrentCorrectPercentage(), 0);
    return this.performances.size > 0 ? total / this.performances.size : 0;
  }

  getAverageTotalCorrectPercentage(): number {
    const total = Array.from(this.performances.values()).reduce((sum, perf) => sum + perf.getTotalCorrectPercentage(), 0);
    return this.performances.size > 0 ? total / this.performances.size : 0;
  }

  getTotalAttempts(): number {
    return Array.from(this.performances.values()).reduce((sum, perf) => sum + perf.totalAttempts, 0);
  }

  getTotalCorrect(): number {
    return Array.from(this.performances.values()).reduce((sum, perf) => sum + perf.totalCorrect, 0);
  }

  getMaxStreak(): number {
    return Math.max(...Array.from(this.performances.values()).map(perf => perf.bestStreak), 0);
  }
}
