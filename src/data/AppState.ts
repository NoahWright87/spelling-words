import { User } from './User';

export class AppState {
  private static instance: AppState;

  private constructor(public users: User[] = [], public currentUserIndex: number | null = null) {}

  static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }

  addUser(user: User) {
    this.users.push(user);
  }

  setCurrentUser(index: number) {
    if (index >= 0 && index < this.users.length) {
      this.currentUserIndex = index;
    } else {
      this.currentUserIndex = null;
    }
  }

  getCurrentUser(): User | null {
    if (this.currentUserIndex !== null) {
      return this.users[this.currentUserIndex];
    }
    return null;
  }
}
