"use client";

import { useEffect, useState } from 'react';
import { User } from '../../data/User';
import { AppState } from '../../data/AppState';
import '../../app/globals.css';
import { SpellingWordList } from '@/data/SpellingWordList';
import { useRouter } from 'next/navigation';

// TODO: Create a separate component for the settings dropdown
// TODO: Create a separate component for the deck selection section

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedPreset, setSelectedPreset] = useState('medium');
  const [wordLists, setWordLists] = useState<SpellingWordList[]>([]);
  const [selectedDecks, setSelectedDecks] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Settings presets
  const presets = {
    easy: {
      showBlanks: true,
      goal: 3,
      streakRequired: 1,
      startingHints: 5,
      hintReduction: 1
    },
    medium: {
      showBlanks: true,
      goal: 4,
      streakRequired: 3,
      startingHints: 3,
      hintReduction: 1
    },
    hard: {
      showBlanks: false,
      goal: 3,
      streakRequired: 3,
      startingHints: 0,
      hintReduction: 1
    }
  };

  useEffect(() => {
    const appState = AppState.getInstance();
    const user = appState.getCurrentUser();
    
    if (!user) {
      router.push('/');
      return;
    }
    
    setCurrentUser(user);
    const lists = Object.values(appState.spellingWordLists);
    setWordLists(lists);
  }, [router]);

  const handlePractice = () => {
    if (selectedDecks.size === 0) return;
    
    const params = new URLSearchParams();
    params.append('listName', Array.from(selectedDecks)[0]); // For now, just use the first deck
    params.append('showBlanks', presets[selectedPreset as keyof typeof presets].showBlanks.toString());
    params.append('goal', presets[selectedPreset as keyof typeof presets].goal.toString());
    params.append('streakRequired', presets[selectedPreset as keyof typeof presets].streakRequired.toString());
    params.append('startingHints', presets[selectedPreset as keyof typeof presets].startingHints.toString());
    params.append('hintReduction', presets[selectedPreset as keyof typeof presets].hintReduction.toString());
    
    router.push(`/practice?${params.toString()}`);
  };

  const toggleDeckSelection = (deckName: string) => {
    const newSelection = new Set(selectedDecks);
    if (newSelection.has(deckName)) {
      newSelection.delete(deckName);
    } else {
      newSelection.add(deckName);
    }
    setSelectedDecks(newSelection);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Hello, {currentUser.name}!</h1>
      
      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* Left column - Deck selection */}
        <div className="column">
          <h2 className="text-2xl font-bold mb-4">Select Decks to Practice</h2>
          <p className="text-lg mb-4">
            {selectedDecks.size} deck{selectedDecks.size !== 1 ? 's' : ''} selected
          </p>
          <div className="grid grid-cols-1 gap-4">
            {wordLists.map((list) => (
              <div 
                key={list.name}
                className={`flex items-center p-4 border rounded cursor-pointer transition-colors ${
                  selectedDecks.has(list.name)
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => toggleDeckSelection(list.name)}
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{list.name}</h3>
                  <p className="text-sm opacity-80">
                    {list.words.length} words
                  </p>
                </div>
                <div className="ml-4">
                  {selectedDecks.has(list.name) ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Practice settings */}
        <div className="column">
          <button 
            className="large-button w-full"
            onClick={handlePractice}
            disabled={selectedDecks.size === 0}
          >
            Practice!
          </button>

          <div className="mt-8">
            <select 
              className="input w-full mb-4"
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <label className="w-1/3">Show blanks</label>
                <input
                  type="checkbox"
                  checked={presets[selectedPreset as keyof typeof presets].showBlanks}
                  disabled
                  className="input w-2/3"
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3">Goal</label>
                <input
                  type="number"
                  value={presets[selectedPreset as keyof typeof presets].goal}
                  disabled
                  className="input w-2/3"
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3">Streak required</label>
                <input
                  type="number"
                  value={presets[selectedPreset as keyof typeof presets].streakRequired}
                  disabled
                  className="input w-2/3"
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3">Starting hints</label>
                <input
                  type="number"
                  value={presets[selectedPreset as keyof typeof presets].startingHints}
                  disabled
                  className="input w-2/3"
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/3">Hint reduction</label>
                <input
                  type="number"
                  value={presets[selectedPreset as keyof typeof presets].hintReduction}
                  disabled
                  className="input w-2/3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}