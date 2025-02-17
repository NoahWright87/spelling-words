import { User } from './User';
import { SpellingWordList } from './SpellingWordList';

export class AppState {
  private static instance: AppState;
  private static readonly LOCAL_STORAGE_KEY = 'appState';

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

  public saveState() {
    const state = {
      users: this.users,
      currentUserIndex: this.currentUserIndex,
      spellingWordLists: this.spellingWordLists,
    };
    localStorage.setItem(AppState.LOCAL_STORAGE_KEY, JSON.stringify(state));
    console.log('State saved to local storage');
    console.log('State:', state);
  }

  private loadState() {
    console.log('Loading state from local storage');
    const state = localStorage.getItem(AppState.LOCAL_STORAGE_KEY);
    console.log('Loaded state:', state);

    if (state) {
      const { users, currentUserIndex, spellingWordLists } = JSON.parse(state);

      // Load users, creating defaults if none were already stored
      if (users) {
        this.users = users.map((user: any) => new User(user.name, user.spellingWordLists));
      } else {
        this.users = [];
      }

      this.currentUserIndex = currentUserIndex ?? null;
    
      // Load spelling word lists, creating defaults if none were already stored
      if (spellingWordLists) {
        this.spellingWordLists = Object.fromEntries(
          Object.entries(spellingWordLists).map(([key, list]: [string, any]) => [key, new SpellingWordList(list.name, list.words)])
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
}
