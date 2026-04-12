import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';
import { Auth, getAuth } from 'firebase/auth';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  readonly app: FirebaseApp;
  readonly auth: Auth;
  readonly database: Database;

  constructor() {
    this.app = getApps().length > 0 ? getApp() : initializeApp(environment.firebase);
    this.auth = getAuth(this.app);
    this.database = getDatabase(this.app);
  }
}
