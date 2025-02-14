import { SpellingWord } from "./SpellingWord";

export class SpellingWordList {
  constructor(public name: string, public words: SpellingWord[] = []) {}

  addWord(word: SpellingWord) {
    this.words.push(word);
  }
}
