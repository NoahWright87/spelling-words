"use client";

import { useEffect, useState } from 'react';
import { User } from '../../data/User';
import { AppState } from '../../data/AppState';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = AppState.getInstance().getCurrentUser();
    setCurrentUser(user);
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1>Welcome, {currentUser.name}!</h1>
      {/* Add more dashboard content here */}
    </div>
  );
}