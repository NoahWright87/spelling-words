"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '../../../data/User';
import { AppState } from '../../../data/AppState';
import { SpellingWordList } from '../../../data/SpellingWordList';

export default function EditWordList() {
  const { key } = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [wordList, setWordList] = useState<SpellingWordList | null>(null);

  useEffect(() => {
    const user = AppState.getInstance().getCurrentUser();
    setCurrentUser(user);
    if (user && key) {
      console.log('User and key found:', user, key);
      let list = user.spellingWordLists[key as string];
      if (!list) {
        console.log('Creating new list with key:', key);
        list = new SpellingWordList(key as string);
        user.addSpellingWordList(list);
      }
      setWordList(list || null);
    }
  }, [key]);

  if (!currentUser) {
    return <div>No user is logged in!</div>;
  }
  if (!wordList) {
    return <div>No word list provided!</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1>Edit Word List: {wordList.name}</h1>
      {/* Add form to edit the word list here */}
    </div>
  );
}
