"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppState } from '@/data/AppState';
import { SpellingWordList } from '@/data/SpellingWordList';
import { SpellingWordPerformance } from '@/data/SpellingWordPerformance';
import Link from 'next/link';

function PracticeResultsContent() {
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
        const user = appState.getCurrentUser();
        if (user) {
          const currentPerformance = user.currentPerformance;
          setPerformance(currentPerformance);
        }
      }
    }
  }, [listName]);

  const calculateStats = () => {
    if (!wordList) return null;

    const totalWords = wordList.words.length;
    const totalAttempts = Object.values(performance).reduce((sum, p) => sum + p.attempts, 0);
    const totalCorrect = Object.values(performance).reduce((sum, p) => sum + p.correct, 0);
    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    return {
      totalWords,
      totalAttempts,
      totalCorrect,
      accuracy
    };
  };

  const stats = calculateStats();

  if (!wordList || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Practice Results for {wordList.name}</h1>
      
      <div className="results-section">
        <div className="results-grid">
          <p>Words: {stats.totalWords}</p>
          <p>{stats.totalCorrect} / {stats.totalAttempts} ({stats.accuracy.toFixed(1)}%)</p>
        </div>
      </div>

      <div className="word-results">
        <table className="bordered">
          <thead>
            <tr>
              <th>Word</th>
              <th>Performance</th>
              <th>Best Streak</th>
            </tr>
          </thead>
          <tbody>
            {wordList.words.map(word => {
              const perf = performance[word.word] || new SpellingWordPerformance(word.word);
              return (
                <tr key={word.word}>
                  <td>{word.word}</td>
                  <td>
                    {perf.correct} / {perf.attempts} ({perf.getPercentage().toFixed(1)}%)
                  </td>
                  <td>{perf.streak}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Link href="/dashboard" className="large-button">
        Done
      </Link>
    </div>
  );
}

export default function PracticeResults() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PracticeResultsContent />
    </Suspense>
  );
}
