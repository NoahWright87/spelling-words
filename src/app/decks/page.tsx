"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppState } from '@/data/AppState';
import { SpellingWordList } from '@/data/SpellingWordList';

export default function DecksPage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState | null>(null);
  const [decks, setDecks] = useState<SpellingWordList[]>([]);

  useEffect(() => {
    setAppState(AppState.getInstance());
  }, []);

  useEffect(() => {
    if (appState) {
      setDecks(Object.values(appState.spellingWordLists));
    }
  }, [appState]);

  const handleDeckClick = (deckName: string) => {
    router.push(`/deck?name=${encodeURIComponent(deckName)}`);
  };

  const handleNewDeck = () => {
    router.push('/deck');
  };

  const handleDeleteDeck = (deckName: string) => {
    if (!appState) return;
    if (confirm('Are you sure you want to delete this deck?')) {
      delete appState.spellingWordLists[deckName];
      appState.saveState();
      setDecks(Object.values(appState.spellingWordLists));
    }
  };

  const handleDone = () => {
    router.push('/');
  };

  if (!appState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Word Decks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck: SpellingWordList) => (
          <div key={deck.name} className="relative group">
            <button
              onClick={() => handleDeckClick(deck.name)}
              className="w-full p-6 text-left bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{deck.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {deck.words.length} words
              </p>
            </button>
            <button
              onClick={() => handleDeleteDeck(deck.name)}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              X
            </button>
          </div>
        ))}

        <button
          onClick={handleNewDeck}
          className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="ml-2">New Deck</span>
        </button>
      </div>

      <div className="large-button text-center">
        <button onClick={handleDone} className="button">
          Done
        </button>
      </div>
    </div>
  );
} 