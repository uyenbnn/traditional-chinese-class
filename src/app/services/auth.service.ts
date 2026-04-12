import { computed, Injectable, signal } from '@angular/core';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import { environment } from '../../environments/environment';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly user = signal<User | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isAdmin = computed(() => {
    const currentUser = this.user();
    return currentUser?.email?.toLowerCase() === environment.adminCredentials.email.toLowerCase();
  });

  constructor(private readonly firebaseService: FirebaseService) {
    onAuthStateChanged(this.firebaseService.auth, (firebaseUser) => {
      this.user.set(firebaseUser);
      this.isLoading.set(false);
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    this.errorMessage.set('');

    const normalizedEmail = email.trim().toLowerCase();
    const expectedEmail = environment.adminCredentials.email.toLowerCase();

    if (normalizedEmail !== expectedEmail || password !== environment.adminCredentials.password) {
      this.errorMessage.set('Invalid admin credentials.');
      return false;
    }

    try {
      await signInWithEmailAndPassword(this.firebaseService.auth, normalizedEmail, password);
      return true;
    } catch {
      this.errorMessage.set('Unable to sign in. Create this account in Firebase Authentication first.');
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.firebaseService.auth);
    this.errorMessage.set('');
  }
}
