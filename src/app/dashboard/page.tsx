"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '../../data/User';
import { AppState } from '../../data/AppState';
import { SpellingWordList } from '../../data/SpellingWordList';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [spellingWordListKeys, setSpellingWordListKeys] = useState<string[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const appState = AppState.getInstance();
    const user = appState.getCurrentUser();
    console.log('User:', user);
    setCurrentUser(user);
    if (user) {
      setSpellingWordListKeys(user.getSpellingWordListKeys());
    }
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleEdit = () => {
    if (selectedList) {
      window.location.href = `/word-list/${selectedList}`;
    }
  };

  const handleAdd = () => {
    if (currentUser) {
      const newKey = currentUser.createNewSpellingWordList();
      window.location.href = `/word-list/${newKey}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1>Welcome, {currentUser.name}!</h1>
      <div className="mt-4">
        <select
          value={selectedList || ''}
          onChange={(e) => setSelectedList(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="" disabled>Select a list</option>
          {spellingWordListKeys.map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded"
          onClick={handleAdd}
        >
          Add
        </button>
        <button
          className="ml-2 p-2 bg-green-500 text-white rounded"
          disabled={!selectedList}
          onClick={handleEdit}
        >
          Edit
        </button>
      </div>
      {/* Add more dashboard content here */}
    </div>
  );
}