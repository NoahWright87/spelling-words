"use client";

import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppState } from '../../data/AppState';
import { SpellingWordList } from '../../data/SpellingWordList';
import { SpellingWordPerformance } from '../../data/SpellingWordPerformance';
import '../../app/globals.css';
import SpeechUtil from '../lib/SpeechUtil';

export default function Practice() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <PracticeInner />
    </React.Suspense>
  );
}

function repeatExampleSentence(currentWord: string | null, wordList: SpellingWordList | null) {
  if (currentWord) {
    const word = wordList?.words.find(w => w.word === currentWord);
    if (word) {
      SpeechUtil.sayExampleSentence(word.word, word.exampleSentence);
    }
  }
}

function PracticeInner() {
  const searchParams = useSearchParams();
  const listName = searchParams.get('listName');
  const showBlanks = searchParams.get('showBlanks') === 'true';
  const goal = Number(searchParams.get('goal'));
  const streakRequired = Number(searchParams.get('streakRequired'));
  const startingHints = Number(searchParams.get('startingHints'));
  const hintReduction = Number(searchParams.get('hintReduction'));

  const [wordList, setWordList] = useState<SpellingWordList | null>(null);
  const [performance, setPerformance] = useState<{ [word: string]: SpellingWordPerformance }>({});
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [hintIndices, setHintIndices] = useState<Set<number>>(new Set());

  const isWordMastered = useCallback((perf: SpellingWordPerformance) => {
    return perf.streak >= streakRequired && perf.correct >= goal;
  }, [streakRequired, goal]);

  const pickRandomWord = useCallback(() => {
    if (wordList) {
      const unmasteredWords = wordList.words.filter(word => !isWordMastered(performance[word.word]));
      if (unmasteredWords.length === 0) {
        console.log('Quiz finished, saving performance...');
        console.log('Current performance state:', performance);
        const appState = AppState.getInstance();
        appState.savePerformance(performance);
        console.log('Performance saved, navigating to results...');
        window.location.href = `/practice-results?listName=${encodeURIComponent(listName || '')}`;
        return;
      }
      const randomIndex = Math.floor(Math.random() * unmasteredWords.length);
      const word = unmasteredWords[randomIndex];
      setCurrentWord(word.word);

      const totalHints = Math.max(startingHints - (performance[word.word]?.streak * hintReduction), 0);
      const newHintIndices = new Set<number>();
      while (newHintIndices.size < totalHints) {
        const randomIndex = Math.floor(Math.random() * word.word.length);
        newHintIndices.add(randomIndex);
      }
      setHintIndices(newHintIndices);

      repeatExampleSentence(word.word, wordList);
    }
  }, [wordList, performance, startingHints, hintReduction, listName, isWordMastered]);

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

  useEffect(() => {
    if (wordList) {
      pickRandomWord();
    }
  }, [wordList, pickRandomWord]);

  const handleSubmit = () => {
    if (!userInput.trim()) {
      repeatExampleSentence(currentWord, wordList);
      return;
    }
    if (currentWord) {
      const performanceEntry = performance[currentWord];
      performanceEntry.attempts += 1;
      if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
        performanceEntry.correct += 1;
        performanceEntry.streak += 1;
        alert('Correct!');
      } else {
        performanceEntry.streak = 0;
        alert('Incorrect!');
      }
      setPerformance({ ...performance, [currentWord]: performanceEntry });
    }
    setUserInput('');
    pickRandomWord();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getBlanks = () => {
    if (!currentWord) return '';
    const wordArray = currentWord.split('');
    const blanks = wordArray.map((char, index) => {
      if (hintIndices.has(index)) {
        return char;
      } else {
        return '_';
      }
    });
    if (showBlanks) {
      return blanks.join(' ');
    } else {
      return blanks.join('');
    }

    repeatExampleSentence(currentWord, wordList);
  };

  if (!wordList) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Practice -- {wordList.name}</h1>
      <div className="word-prompt">
        {getBlanks()}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type the word here"
        className='input'
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}