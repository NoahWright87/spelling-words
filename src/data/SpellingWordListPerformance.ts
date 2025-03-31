import { SpellingWordPerformance } from './SpellingWordPerformance';

export class SpellingWordListPerformance {
  private performances: Map<string, SpellingWordPerformance>;

  constructor() {
    this.performances = new Map();
  }

  combineWith(other: SpellingWordListPerformance) {
    console.log('combineWith called with:', other);
    console.log('Current performances:', this.performances);
    other.performances.forEach((perf, word) => {
      console.log(`Processing word ${word}:`, perf);
      if (!this.performances.has(word)) {
        this.performances.set(word, perf);
        console.log(`Added new performance for ${word}`);
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
          console.log(`Updated existing performance for ${word}:`, existing);
        }
      }
    });
    console.log('Final performances:', this.performances);
  }

  addWord(word: string) {
    console.log(`Adding word ${word}`);
    if (!this.performances.has(word)) {
      this.performances.set(word, new SpellingWordPerformance(word));
      console.log(`Added new performance for ${word}`);
    }
    console.log('Current performances:', this.performances);
  }

  getPerformance(word: string): SpellingWordPerformance | undefined {
    const perf = this.performances.get(word);
    console.log(`Getting performance for ${word}:`, perf);
    return perf;
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

  // Method to get all performances for reconstruction
  getAllPerformances(): Map<string, SpellingWordPerformance> {
    console.log('Getting all performances:', this.performances);
    return new Map(this.performances);
  }
}
