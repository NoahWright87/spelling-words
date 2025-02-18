"use client";

import { useEffect, useState } from 'react';
import { User } from '../../data/User';
import { AppState } from '../../data/AppState';
import '../../app/globals.css';
import { SpellingWordList } from '@/data/SpellingWordList';
import ListBox from '../components/ListBox';
import { useRouter } from 'next/navigation';
import PerformanceWidget from '../components/PerformanceWidget';
import { SpellingWordPerformance } from '@/data/SpellingWordPerformance';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [wordLists, setWordLists] = useState<SpellingWordList[]>([]);
  const [selectedList, setSelectedList] = useState<SpellingWordList | null>(null);
  const [showBlanks, setShowBlanks] = useState(false);
  const [goal, setGoal] = useState(1);
  const [streakRequired, setStreakRequired] = useState(0);
  const [startingHints, setStartingHints] = useState(0);
  const [hintReduction, setHintReduction] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const appState = AppState.getInstance();
    const user = appState.getCurrentUser();
    setCurrentUser(user);
    const lists = Object.values(appState.spellingWordLists);
    setWordLists(lists);
  }, []);

  const handlePracticeClick = () => {
    if (selectedList) {
      const queryParams = new URLSearchParams({
        listName: selectedList.name,
        showBlanks: showBlanks.toString(),
        goal: goal.toString(),
        streakRequired: streakRequired.toString(),
        startingHints: startingHints.toString(),
        hintReduction: hintReduction.toString(),
      });
      router.push(`/practice?${queryParams.toString()}`);
    }
  };

  const handleShowBlanksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowBlanks(e.target.checked);
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal(Number(e.target.value));
  };

  const handleStreakRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreakRequired(Number(e.target.value));
  };

  const handleStartingHintsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartingHints(Number(e.target.value));
  };

  const handleHintReductionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHintReduction(Number(e.target.value));
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Welcome, {currentUser.name}!</h1>
      <div className="grid">
        <div className="column">
          <h2>Settings</h2>
          <form className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <label className="w-1/3">Show blanks</label>
              <input
                type="checkbox"
                checked={showBlanks}
                onChange={handleShowBlanksChange}
                className="input w-2/3"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3">Goal</label>
              <input
                type="number"
                value={goal}
                onChange={handleGoalChange}
                min="1"
                className="input w-2/3"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3">Streak required</label>
              <input
                type="number"
                value={streakRequired}
                onChange={handleStreakRequiredChange}
                min="0"
                max={goal}
                className="input w-2/3"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3">Starting hints</label>
              <input
                type="number"
                value={startingHints}
                onChange={handleStartingHintsChange}
                min="0"
                className="input w-2/3"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3">Hint reduction</label>
              <input
                type="number"
                value={hintReduction}
                onChange={handleHintReductionChange}
                min="0"
                max={startingHints}
                className="input w-2/3"
              />
            </div>
          </form>
        </div>
        <div className="column">
          <h2>Spelling Word Lists</h2>
          <ListBox
            items={wordLists}
            onAdd={() => {}}
            onRemove={() => {}}
            onSelect={setSelectedList}
            getKey={(item) => item.name}
            maxItems={10}
          />
        </div>
        <div className="column">
          <h2>Stats {selectedList ? `- ${selectedList.name}` : ''}</h2>
          {selectedList && (
            <PerformanceWidget performanceList={currentUser.getPerformanceForList(selectedList.name)} />
          )}
          <button className="button" onClick={handlePracticeClick}>Practice</button>
        </div>
      </div>
    </div>
  );
}