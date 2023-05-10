import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Observable, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private auth: Auth) { }

  async register(email: any, password: any) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    return userCredential;
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  getUserId(): string | null {
    const user = this.auth.currentUser;
    if (user) {
      return user.uid;
    } else {
      return null;
    }
  }
}
