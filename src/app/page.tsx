"use client";

import { AppState } from '../data/AppState';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { User } from '../data/User';

export default function Home() {
  const [users, setUsers] = useState<string[]>([]);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Fetch users from AppState
    const userNames = AppState.getInstance().users.map(user => user.name);
      setUsers(userNames);
      }, []);

  const handleLogin = () => {
    let userIndex = users.indexOf(name);
    if (userIndex === -1) {
      const newUser = new User(name);
      AppState.getInstance().addUser(newUser);
      userIndex = AppState.getInstance().users.length - 1;
    }
    AppState.getInstance().setCurrentUser(userIndex);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1>Pick your name or type it in:</h1>
      <input
        list="names"
        name="name"
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <datalist id="names">
        {users.map((name, index) => (
          <option key={index} value={name} />
        ))}
      </datalist>
      <button className="button mt-4" disabled={!name} onClick={handleLogin}>
        Login
      </button>
      <button className="button mt-4" onClick={() => router.push('/word-setup')}>
        Setup
      </button>
    </div>
  );
}
