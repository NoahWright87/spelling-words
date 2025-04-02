import { User } from './User';
import { SpellingWordList } from './SpellingWordList';
import { SpellingWordPerformance } from './SpellingWordPerformance';

export class AppState {
  private static instance: AppState;
  private static readonly LOCAL_STORAGE_KEY = 'appState';
  private subscribers: Set<() => void> = new Set();

  private constructor(
    public users: User[] = [],
    public currentUserIndex: number | null = null,
    public spellingWordLists: { [key: string]: SpellingWordList } = {}
  ) {
    this.loadState();
  }

  static getInstance(): AppState {
    console.log("Getting app state");
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }

  subscribe(callback: () => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  public saveState() {
    const state = {
      users: this.users,
      currentUserIndex: this.currentUserIndex,
      spellingWordLists: this.spellingWordLists,
    };
    localStorage.setItem(AppState.LOCAL_STORAGE_KEY, JSON.stringify(state));
    console.log('State saved to local storage');
    console.log('State:', state);
    this.notifySubscribers();
  }

  private loadState() {
    console.log('Loading state from local storage');
    const state = localStorage.getItem(AppState.LOCAL_STORAGE_KEY);
    console.log('Loaded state:', state);

    if (state) {
      const { users, currentUserIndex, spellingWordLists } = JSON.parse(state) as { users: User[], currentUserIndex: number | null, spellingWordLists: { [key: string]: SpellingWordList } };
      
      // Load users, creating defaults if none were already stored
      if (users) {
        this.users = users.map((user: User) => {
          // Reconstruct the performance maps
          const currentPerformance: { [word: string]: SpellingWordPerformance } = {};
          const totalPerformance: { [word: string]: SpellingWordPerformance } = {};

          if (user.currentPerformance) {
            Object.entries(user.currentPerformance).forEach(([word, perf]) => {
              currentPerformance[word] = new SpellingWordPerformance(
                word,
                perf.attempts,
                perf.correct,
                perf.streak
              );
            });
          }

          if (user.totalPerformance) {
            Object.entries(user.totalPerformance).forEach(([word, perf]) => {
              totalPerformance[word] = new SpellingWordPerformance(
                word,
                perf.attempts,
                perf.correct,
                perf.streak
              );
            });
          }

          return new User(user.name, currentPerformance, totalPerformance);
        });
      } else {
        this.users = [];
      }

      this.currentUserIndex = currentUserIndex ?? null;
    
      // Load spelling word lists, creating defaults if none were already stored
      if (spellingWordLists) {
        this.spellingWordLists = Object.fromEntries(
          Object.entries(spellingWordLists).map(([key, list]) => [key, new SpellingWordList(list.name, list.words)])
        );
      } else {
        this.spellingWordLists = {};
      }

    } else {
      this.users = [];
      this.currentUserIndex = null;
      this.spellingWordLists = {};
    }
  }

  addUser(user: User) {
    this.users.push(user);
    this.saveState();
    console.log('User added:', user);
  }

  updateUser(updatedUser: User) {
    const userIndex = this.users.findIndex(user => user.name === updatedUser.name);
    if (userIndex !== -1) {
      this.users[userIndex] = updatedUser;
      this.saveState();
      console.log('User updated:', updatedUser);
    }
  }

  setCurrentUser(index: number) {
    if (index >= 0 && index < this.users.length) {
      this.currentUserIndex = index;
      this.saveState();
      console.log('Current user index set to:', index);
    } else {
      this.currentUserIndex = null;
      this.saveState();
      console.log('Invalid user index, currentUserIndex set to null');
    }
  }

  getCurrentUser(): User | null {
    if (this.currentUserIndex !== null) {
      console.log('Current user:', this.users[this.currentUserIndex]);
      return this.users[this.currentUserIndex];
    }
    console.log('No current user, returning null');
    return null;
  }

  addSpellingWordList(list: SpellingWordList) {
    this.spellingWordLists[list.name] = list;
    this.saveState();
    console.log('Spelling word list added:', list);
  }

  getSpellingWordList(name: string): SpellingWordList | null {
    return this.spellingWordLists[name] || null;
  }

  deleteUser(userName: string) {
    const userIndex = this.users.findIndex(user => user.name === userName);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      // If the deleted user was the current user, clear the current user
      if (this.currentUserIndex === userIndex) {
        this.currentUserIndex = null;
      } else if (this.currentUserIndex !== null && this.currentUserIndex > userIndex) {
        // If the deleted user was before the current user, adjust the current user index
        this.currentUserIndex--;
      }
      this.saveState();
      console.log('User deleted:', userName);
    }
  }

  savePerformance(performance: { [word: string]: SpellingWordPerformance }) {
    console.log('AppState.savePerformance called with:', performance);
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      console.error('No current user found');
      return;
    }
    console.log('Current user found:', currentUser);

    currentUser.recordPerformance(performance);
    this.saveState();
    console.log('Performance saved');
  }
}
