import { SpellingWordPerformance } from './SpellingWordPerformance';

export class User {
  constructor(
    public name: string,
    public currentPerformance: { [word: string]: SpellingWordPerformance } = {},
    public totalPerformance: { [word: string]: SpellingWordPerformance } = {}
  ) {}

  // addSpellingWordList(listName: string) {
  //   if (!this.spellingWordLists[listName]) {
  //     this.spellingWordLists[listName] = new SpellingWordListPerformance();
  //   }
  // }

  // getSpellingWordListKeys(): string[] {
  //   return Object.keys(this.spellingWordLists);
  // }

  getPerformanceForList(listName: string): SpellingWordListPerformance {
    if (!this.spellingWordLists[listName]) {
      this.spellingWordLists[listName] = new SpellingWordListPerformance();
    }
    return this.spellingWordLists[listName];
  }

  recordPerformance(performance: { [word: string]: SpellingWordPerformance }) {
    console.log(`Recording performance for user ${this.name}:`, performance);
    
    // Update current performance (replace)
    this.currentPerformance = { ...performance };
    
    // Update total performance (combine)
    Object.entries(performance).forEach(([word, perf]) => {
      const existingTotal = this.totalPerformance[word];
      if (existingTotal) {
        this.totalPerformance[word] = existingTotal.combineWith(perf);
      } else {
        this.totalPerformance[word] = perf;
      }
    });
    
    console.log('Updated current performance:', this.currentPerformance);
    console.log('Updated total performance:', this.totalPerformance);
  }
}
