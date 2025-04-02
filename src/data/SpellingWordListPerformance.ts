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
          existing.attempts = perf.attempts;
          existing.correct = perf.correct;
          existing.streak = perf.streak;
          existing.attempts += perf.attempts;
          existing.correct += perf.correct;
          if (perf.streak > existing.streak) {
            existing.streak = perf.streak;
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
    const total = Array.from(this.performances.values()).reduce((sum, perf) => sum + perf.getPercentage(), 0);
    return this.performances.size > 0 ? total / this.performances.size : 0;
  }

  getAverageTotalCorrectPercentage(): number {
    const total = Array.from(this.performances.values()).reduce((sum, perf) => sum + perf.getPercentage(), 0);
    return this.performances.size > 0 ? total / this.performances.size : 0;
  }

  getTotalAttempts(): number {
    return Array.from(this.performances.values()).reduce((sum, perf) => sum + perf.attempts, 0);
  }

  getTotalCorrect(): number {
    return Array.from(this.performances.values()).reduce((sum, perf) => sum + perf.correct, 0);
  }

  getMaxStreak(): number {
    return Math.max(...Array.from(this.performances.values()).map(perf => perf.streak), 0);
  }

  // Method to get all performances for reconstruction
  getAllPerformances(): Map<string, SpellingWordPerformance> {
    console.log('Getting all performances:', this.performances);
    return new Map(this.performances);
  }
}
