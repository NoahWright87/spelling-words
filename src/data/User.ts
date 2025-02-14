import { SpellingWordList } from "./SpellingWordList";

export class User {
  constructor(public name: string, public spellingWordLists: { [key: string]: SpellingWordList } = {}) {}

  addSpellingWordList(list: SpellingWordList) {
    this.spellingWordLists[list.name] = list;
  }
}
