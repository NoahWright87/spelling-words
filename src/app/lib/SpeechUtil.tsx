export default class SpeechUtil {
    // Constants for spelling word speech
    static wordRate = 0.75;
    static wordPitch = 1.2;
    static wordVolume = 1.1;

    // Constants for example sentence speech
    static sentenceRate = 1.0;
    static sentencePitch = 1.0;
    static sentenceVolume = 1.0;


  static saySpellingWord(word: string) {
    speechSynthesis.cancel();
    const utterance = this.createSpellingWordUtterance(word);
    speechSynthesis.speak(utterance);
  }

  private static createSpellingWordUtterance(word: string) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = this.wordRate;
    utterance.pitch = this.wordPitch;
    utterance.volume = this.wordVolume;
    return utterance;
  }

  static sayExampleSentence(word: string, sentence: string) {
    speechSynthesis.cancel();
    const parts = sentence
        // Pad around %% with spaces to ensure the word is spoken first
        .replace(/%%/g, ' %% ')
        .split('%%');

    let utterances: SpeechSynthesisUtterance[] = [];

    parts.forEach((part, index) => {
        if (index > 0) {
            utterances.push(this.createSpellingWordUtterance(word));
        }

      const utterance = new SpeechSynthesisUtterance(part);
      utterance.rate = this.sentenceRate;
      utterance.pitch = this.sentencePitch;
      utterance.volume = this.sentenceVolume;
      utterances.push(utterance);
    });

    function speakChained(index = 0) {
        if (index < utterances.length) {
          const current = utterances[index];
          current.onend = () => speakChained(index + 1);
          speechSynthesis.speak(current);
        }
      }

      speakChained();
  }
  
}