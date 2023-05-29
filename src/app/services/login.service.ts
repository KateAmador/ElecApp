import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, authState, updateCurrentUser } from '@angular/fire/auth';
import 'firebase/auth';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth: Auth,
    private angFire: AngularFirestore) { }

  async register(email: any, password: any) {
    const originalUser = this.auth.currentUser;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential;

    } catch (error) {
      console.error('Error al crear el nuevo usuario:', error);
      throw error;

    } finally {
      if (originalUser) {
        await updateCurrentUser(this.auth, originalUser);
        console.log('Usuario original restaurado');
      }
    }
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

  stateUser() {
    return authState(this.auth);
  }

  getDoc<type>(path: string, id: string) {
    return this.angFire.collection(path).doc<type>(id).valueChanges();;
  }
}
