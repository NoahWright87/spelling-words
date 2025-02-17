"use client";

import '../globals.css';
import ListBox from '../components/ListBox';
import { useEffect, useState } from 'react';
import { AppState } from '../../data/AppState';
import { SpellingWordList } from '../../data/SpellingWordList';
import { SpellingWord } from '../../data/SpellingWord';
import SpeechUtil from '../lib/SpeechUtil';

export default function WordSetup() {
  const [wordLists, setWordLists] = useState<SpellingWordList[]>([]);
  const [selectedList, setSelectedList] = useState<SpellingWordList | null>(null);
  const [selectedWord, setSelectedWord] = useState<SpellingWord | null>(null);
  const [exampleSentence, setExampleSentence] = useState<string>('');
  const [word, setWord] = useState<string>('');
  const [newListName, setNewListName] = useState<string>('');

  useEffect(() => {
    const appState = AppState.getInstance();
    const lists = Object.values(appState.spellingWordLists);
    setWordLists(lists);
  }, []);

  const handleAddWordList = (key: string) => {
    const newList = new SpellingWordList(key);
    setWordLists([...wordLists, newList]);
    AppState.getInstance().spellingWordLists[key] = newList;
    AppState.getInstance().saveState();
  };

  const handleRemoveWordList = (key: string) => {
    setWordLists(wordLists.filter((list) => list.name !== key));
    delete AppState.getInstance().spellingWordLists[key];
    AppState.getInstance().saveState();
  };

  const handleSelectWordList = (item: SpellingWordList) => {
    setSelectedList(item);
    setSelectedWord(null);
    setExampleSentence('');
    setWord('');
    setNewListName(item.name);
  };

  const handleAddWord = (word: string) => {
    if (selectedList) {
      const newWord = new SpellingWord(word, word);
      selectedList.words.push(newWord);
      setSelectedList(new SpellingWordList(selectedList.name, selectedList.words));
      
      AppState.getInstance().saveState();
    }
  };

  const handleRemoveWord = (word: string) => {
    if (selectedList) {
      selectedList.words = selectedList.words.filter((w) => w.word !== word);
      setSelectedList(new SpellingWordList(selectedList.name, selectedList.words));

      AppState.getInstance().saveState();
    }
  };

  const handleSelectWord = (word: SpellingWord) => {
    setSelectedWord(word);
    setExampleSentence(word.exampleSentence || '');
    setWord(word.word);
  };

  const handleSayWord = () => {
    if (word) {
      SpeechUtil.saySpellingWord(word);
    }
  };

  const handleTestWord = () => {
    if (word && exampleSentence) {
      SpeechUtil.sayExampleSentence(word, exampleSentence);
    }
  };

  const handleSaveWord = () => {
    if (selectedWord) {
      selectedWord.word = word;
      selectedWord.exampleSentence = exampleSentence;
      const appState = AppState.getInstance();
      appState.saveState();
    }
  };

  const handleSaveListName = () => {
    if (selectedList) {
      selectedList.name = newListName;
      setSelectedList(new SpellingWordList(newListName, selectedList.words));
      const appState = AppState.getInstance();
      appState.saveState();
    }
  };

  return (
    <div className="container">
      <h1>Word Setup Page</h1>
      <div className="grid">
        <div className="column">
          <h2>Word Lists</h2>
          <ListBox
            items={wordLists}
            onAdd={handleAddWordList}
            onRemove={handleRemoveWordList}
            onSelect={handleSelectWordList}
            getKey={(item) => item.name}
            maxItems={10}
          />
        </div>
        <div className="column">
          {selectedList ? (
            <>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="input"
              />
              <button onClick={handleSaveListName} className="button" style={{ marginLeft: '10px' }} disabled={newListName === selectedList.name}>Save</button>
              <ListBox
                items={selectedList.words}
                onAdd={handleAddWord}
                onRemove={handleRemoveWord}
                onSelect={handleSelectWord}
                getKey={(item: SpellingWord) => item.word}
                maxItems={10}
              />
            </>
          ) : (
            <p>Select a list to see its contents</p>
          )}
        </div>
        <div className="column">
          {selectedWord ? (
            <>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
              <button onClick={handleSayWord} className="button" style={{ marginTop: '10px' }}>Say</button>
              <textarea
                value={exampleSentence}
                onChange={(e) => setExampleSentence(e.target.value)}
                className="input"
                placeholder="Example sentence"
                style={{ width: '100%', height: '100px' }}
              />
              <button onClick={handleTestWord} className="button" style={{ marginTop: '10px' }}>Test</button>
              <hr />
              <button onClick={handleSaveWord} className="button" style={{ marginTop: '10px' }} disabled={word === selectedWord?.word && exampleSentence === selectedWord?.exampleSentence}>Save</button>
            </>
          ) : (
            <p>Select a word to see its details</p>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => window.location.href = '/'} className="button">Done</button>
      </div>
    </div>
  );
}