import { SpellingWordList } from "./SpellingWordList";

export class User {
  constructor(public name: string, public spellingWordLists: { [key: string]: SpellingWordList } = {}) {}

  addSpellingWordList(list: SpellingWordList) {
    this.spellingWordLists[list.name] = list;
  }

  getSpellingWordListKeys(): string[] {
    return Object.keys(this.spellingWordLists);
  }

  createNewSpellingWordList(): string {
    const newKey = `New${Date.now()}`;
    const newList = new SpellingWordList(newKey);
    this.addSpellingWordList(newList);
    return newKey;
  }
}
