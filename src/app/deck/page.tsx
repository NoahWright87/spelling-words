"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppState } from '@/data/AppState';
import { SpellingWordList } from '@/data/SpellingWordList';
import { SpellingWord } from '@/data/SpellingWord';
import WordRow from '../components/WordRow';

export default function DeckPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deckName, setDeckName] = useState('');
  const [isNewDeck, setIsNewDeck] = useState(true);
  const [appState] = useState(AppState.getInstance());
  const [words, setWords] = useState<SpellingWord[]>([]);
  const [newWord, setNewWord] = useState<SpellingWord>(new SpellingWord('', ''));

  useEffect(() => {
    const deckNameParam = searchParams.get('name');
    if (deckNameParam) {
      const deck = appState.spellingWordLists[deckNameParam];
      if (deck) {
        setDeckName(deck.name);
        setWords(deck.words);
        setIsNewDeck(false);
      }
    }
  }, [searchParams, appState.spellingWordLists]);

  const handleSave = () => {
    if (!deckName.trim()) {
      alert('Please enter a deck name');
      return;
    }

    if (isNewDeck) {
      appState.addSpellingWordList(new SpellingWordList(deckName, words));
    } else {
      const existingDeck = appState.spellingWordLists[deckName];
      if (existingDeck) {
        existingDeck.words = words;
        appState.saveState();
      }
    }

    router.push('/decks');
  };

  const handleCancel = () => {
    router.push('/decks');
  };

  const handleWordUpdate = (index: number, updatedWord: SpellingWord) => {
    const newWords = [...words];
    newWords[index] = updatedWord;
    setWords(newWords);
  };

  const handleWordDelete = (index: number) => {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  };

  const handleNewWordFilled = (word: SpellingWord) => {
    setWords([...words, word]);
    setNewWord(new SpellingWord('', ''));
  };

  return (
    <div className="container max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isNewDeck ? 'Create New Deck' : 'Edit Deck'}
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Deck Name</label>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="input w-full"
            placeholder="Enter deck name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Words</label>
          <div className="border rounded p-2 space-y-1 bg-gray-50 dark:bg-gray-800">
            {words.map((word, index) => (
              <WordRow
                key={index}
                word={word}
                onUpdate={(updatedWord: SpellingWord) => handleWordUpdate(index, updatedWord)}
                onDelete={() => handleWordDelete(index)}
              />
            ))}
            <WordRow
              word={newWord}
              onUpdate={setNewWord}
              onDelete={() => {}}
              isNewRow={true}
              onNewRowFilled={handleNewWordFilled}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            className="large-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="large-button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
