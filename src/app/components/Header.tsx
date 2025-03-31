"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppState } from '../../data/AppState';

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const appState = AppState.getInstance();
    const updateCurrentUser = () => {
      const user = appState.getCurrentUser();
      setCurrentUser(user ? user.name : null);
    };

    // Initial update
    updateCurrentUser();

    // Subscribe to changes
    const unsubscribe = appState.subscribe(updateCurrentUser);

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    const appState = AppState.getInstance();
    appState.setCurrentUser(-1); // This will set currentUserIndex to null
    router.push('/');
  };

  return (
    <header className="header">
      <Link href="/">
        <h1 className="title">Spelling Cards</h1>
      </Link>
      {currentUser && (
        <div className="flex items-center">
          <span className="user-name">{currentUser}</span>
          <button
            className="logout-button"
            onClick={handleLogout}
            title="Switch user"
          >
            ❌
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
