"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppState } from "../data/AppState";
import { UserCard } from "../components/UserCard";

export default function Home() {
  const [users, setUsers] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [deckCount, setDeckCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const appState = AppState.getInstance();
    const userNames = appState.users.map((user) => user.name);
    setUsers(userNames);
    setDeckCount(Object.keys(appState.spellingWordLists).length);
    
    // Log out current user when landing on home page
    appState.setCurrentUser(-1);
  }, []);

  const navigateToUserPage = (userName?: string) => {
    if (userName) {
      if (editMode) {
        router.push(`/user?name=${encodeURIComponent(userName)}`);
      } else {
        const appState = AppState.getInstance();
        const userIndex = appState.users.findIndex(u => u.name === userName);
        if (userIndex !== -1) {
          appState.setCurrentUser(userIndex);
          router.push(`/dashboard?name=${encodeURIComponent(userName)}`);
        }
      }
    } else {
      router.push(`/user`);
    }
  };

  const handleDelete = (userName: string) => {
    if (confirm(`Are you sure you want to delete ${userName}?`)) {
      const appState = AppState.getInstance();
      appState.deleteUser(userName);
      setUsers(appState.users.map((user) => user.name));
    }
  };

  const handleHelp = () => {
    alert("Create 'decks' of spelling words, then make a user, then practice!");
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="header">Welcome to Spelling Cards! 🃏</h1>
      
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => router.push('/decks')}
          className={`large-button ${deckCount === 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {deckCount === 0 ? 'Create Spelling Deck' : `${deckCount} Spelling Deck${deckCount === 1 ? '' : 's'}`}
        </button>
        <button
          className="large-button"
          onClick={handleHelp}
        >
          ❓
        </button>
      </div>

      {deckCount > 0 && (
        <>
          <h2 className="header">Who's playing?</h2>
          <div className="user-buttons">
            {users.map((name, index) => (
              <UserCard
                key={index}
                name={name}
                onSelect={navigateToUserPage}
                onDelete={handleDelete}
                showDelete={editMode}
              />
            ))}
            <UserCard
              onSelect={navigateToUserPage}
            />
            <button
              className="large-button"
              onClick={() => setEditMode(!editMode)}
            >
              🛠️
            </button>
          </div>
        </>
      )}
    </div>
  );
}
