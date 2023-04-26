import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private auth: Auth) { }

  register(email: any, password: any) {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUserName() {
    const user = this.auth.currentUser;
    if (user) {
      return user.email;
    } else {
      return null;
    }
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
}
