"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppState } from '../../data/AppState';

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = AppState.getInstance().getCurrentUser();
    setCurrentUser(user ? user.name : null);
  }, []);

  return (
    <header className="header">
      <Link href="/">
        <h1 className="title">Spelling Words</h1>
      </Link>
      {currentUser && <span className="user-name">{currentUser}</span>}
    </header>
  );
};

export default Header;
