"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppState } from '../../data/AppState';
import { SpellingWordList } from '../../data/SpellingWordList';
import { SpellingWordPerformance } from '../../data/SpellingWordPerformance';
import '../../app/globals.css';
import SpeechUtil from '../lib/SpeechUtil';

// Define the type for practice settings
interface PracticeSettings {
  listName: string;
  showBlanks: boolean;
  goal: number;
  streakRequired: number;
  startingHints: number;
  hintReduction: number;
}

export default function Practice() {
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
  }, [wordList]);

  const pickRandomWord = () => {
    if (wordList) {
      const unmasteredWords = wordList.words.filter(word => !performance[word.word]?.isMastered);
      if (unmasteredWords.length === 0) {
        alert('Congratulations! All words are mastered.');
        window.location.href = '/dashboard';
        return;
      }
      const randomIndex = Math.floor(Math.random() * unmasteredWords.length);
      const word = unmasteredWords[randomIndex];
      setCurrentWord(word.word);

      const totalHints = Math.max(startingHints - (performance[word.word]?.currentStreak * hintReduction), 0);
      const newHintIndices = new Set<number>();
      while (newHintIndices.size < totalHints) {
        const randomIndex = Math.floor(Math.random() * word.word.length);
        newHintIndices.add(randomIndex);
      }
      setHintIndices(newHintIndices);

      SpeechUtil.sayExampleSentence(word.word, word.exampleSentence);
    }
  };

  const handleSubmit = () => {
    if (!userInput.trim()) {
      if (currentWord) {
        const word = wordList?.words.find(w => w.word === currentWord);
        if (word) {
          SpeechUtil.sayExampleSentence(word.word, word.exampleSentence);
        }
      }
      return;
    }
    if (currentWord) {
      const performanceEntry = performance[currentWord];
      performanceEntry.currentAttempts += 1;
      if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
        performanceEntry.correctSpellings += 1;
        performanceEntry.currentStreak += 1;
        alert('Correct!');
      } else {
        performanceEntry.currentStreak = 0;
        alert('Incorrect!');
      }
      performanceEntry.isMastered = performanceEntry.currentStreak >= streakRequired && performanceEntry.correctSpellings >= goal;
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