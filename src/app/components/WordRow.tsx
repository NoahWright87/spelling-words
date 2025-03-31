import { SpellingWord } from '@/data/SpellingWord';
import SpeechUtil from '../lib/SpeechUtil';
import { useEffect, useRef } from 'react';

interface WordRowProps {
  word: SpellingWord;
  onUpdate: (word: SpellingWord) => void;
  onDelete: (word: SpellingWord) => void;
  isNewRow?: boolean;
  onNewRowFilled?: (word: SpellingWord) => void;
}

export default function WordRow({ word, onUpdate, onDelete, isNewRow = false, onNewRowFilled }: WordRowProps) {
  const wordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNewRow) {
      setTimeout(() => {
        wordInputRef.current?.focus();
      }, 0);
    }
  }, [isNewRow]);

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWord = new SpellingWord(e.target.value, word.exampleSentence);
    onUpdate(newWord);
  };

  const handleSentenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWord = new SpellingWord(word.word, e.target.value);
    onUpdate(newWord);
  };

  const handleSentenceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && !e.shiftKey && isNewRow && onNewRowFilled && word.word.trim() && e.currentTarget.value.trim()) {
      e.preventDefault();
      e.stopPropagation();
      onNewRowFilled(new SpellingWord(word.word, e.currentTarget.value));
    }
  };

  const handleSpeak = () => {
    if (word.word && word.exampleSentence) {
      SpeechUtil.sayExampleSentence(word.word, word.exampleSentence);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      onDelete(word);
    }
  };

  return (
    <div className="flex gap-2 items-center py-1">
      <input
        ref={wordInputRef}
        type="text"
        value={word.word}
        onChange={handleWordChange}
        className="input flex-1 min-w-[150px]"
        placeholder="Enter word"
      />
      <input
        type="text"
        value={word.exampleSentence}
        onChange={handleSentenceChange}
        onKeyDown={handleSentenceKeyDown}
        className="input flex-3 min-w-[300px]"
        placeholder="Enter example sentence"
      />
      <button
        onClick={handleSpeak}
        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        title="Speak word and sentence"
      >
        🔊
      </button>
      <button
        onClick={handleDelete}
        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        title="Delete word"
      >
        🗑️
      </button>
    </div>
  );
} 