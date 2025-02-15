import { User } from './User';

export class AppState {
  private static instance: AppState;
  private static readonly LOCAL_STORAGE_KEY = 'appState';

  private constructor(public users: User[] = [], public currentUserIndex: number | null = null) {
    this.loadState();
  }

  static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }

  private saveState() {
    const state = {
      users: this.users,
      currentUserIndex: this.currentUserIndex,
    };
    localStorage.setItem(AppState.LOCAL_STORAGE_KEY, JSON.stringify(state));
    console.log('State saved to local storage');
  }

  private loadState() {
    const state = localStorage.getItem(AppState.LOCAL_STORAGE_KEY);
    if (state) {
      const { users, currentUserIndex } = JSON.parse(state);
      this.users = users.map((user: any) => new User(user.name, user.spellingWordLists));
      this.currentUserIndex = currentUserIndex;
      console.log('State loaded from local storage', this.users);
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
}
