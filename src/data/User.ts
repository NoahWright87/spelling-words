import { SpellingWordListPerformance } from './SpellingWordListPerformance';

export class User {
  constructor(public name: string, public spellingWordLists: { [key: string]: SpellingWordListPerformance } = {}) {}

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

  recordPerformance(listName: string, newPerformance: SpellingWordListPerformance) {
    if (!newPerformance) return;
    
    const pastPerformance = this.getPerformanceForList(listName);
    pastPerformance.combineWith(newPerformance);
    this.spellingWordLists[listName] = pastPerformance;
  }
}
