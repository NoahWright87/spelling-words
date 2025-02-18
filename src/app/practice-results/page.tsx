"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppState } from '../../data/AppState';
import { SpellingWordList } from '../../data/SpellingWordList';
import { SpellingWordPerformance } from '../../data/SpellingWordPerformance';
import '../../app/globals.css';

export default function PracticeResults() {
  const searchParams = useSearchParams();
  const listName = searchParams.get('listName');

  const [wordList, setWordList] = useState<SpellingWordList | null>(null);
  const [performance, setPerformance] = useState<{ [word: string]: SpellingWordPerformance }>({});

  useEffect(() => {
    if (listName) {
      const appState = AppState.getInstance();
      const list = appState.spellingWordLists[listName];
      setWordList(list || null);
      if (list) {
        const initialPerformance: { [word: string]: SpellingWordPerformance } = {};
        list.words.forEach(word => {
          initialPerformance[word.word] = new SpellingWordPerformance(word.word);
        });
        setPerformance(initialPerformance);
      }
    }
  }, [listName]);

  if (!wordList) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Practice Results -- {wordList.name}</h1>
      <ul>
        {wordList.words.map(word => (
          <li key={word.word}>
            {word.word} - Correct: {performance[word.word]?.correctSpellings || 0}, Streak: {performance[word.word]?.currentStreak || 0}
          </li>
        ))}
      </ul>
    </div>
  );
}
