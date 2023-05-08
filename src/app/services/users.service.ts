import { Injectable } from '@angular/core';
import { Firestore, doc, collection, setDoc, collectionData, deleteDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Leader } from '../interfaces/leader.interface';
import { Witness } from '../interfaces/witnesses.interface';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: Firestore) { }

  async addUser(candidateId: string, user: Leader | Witness) {
    const candidateDocRef = doc(this.firestore, `Candidato/${candidateId}`);

    if (user.rol === 'lider') {
      const leadersColRef = collection(candidateDocRef, 'Lideres');
      return setDoc(doc(leadersColRef, user.uid), user);
    } else if (user.rol === 'testigo') {
      const testigosColRef = collection(candidateDocRef, 'Testigos');
      return setDoc(doc(testigosColRef, user.uid), user);
    }
  }

  getUsers(candidateId: string, user: Leader | Witness): Observable<Leader[] | Witness[]> {
    const candidateDocRef = doc(this.firestore, `Candidato/${candidateId}`);

    if (user.rol === 'lider') {
      const leaderRef = collection(candidateDocRef, 'Lideres');
      return collectionData(leaderRef, { idField: 'id' }) as Observable<Leader[]>;
    } else if (user.rol === 'testigo') {
      const testigosRef = collection(candidateDocRef, 'Testigos');
      return collectionData(testigosRef, { idField: 'id' }) as Observable<Witness[]>;
    }
    throw new Error('Rol invalido');
  }

  async deleteUser(user: Leader | Witness, candidateId: string) {

    if (user.rol === 'lider') {
      const leaderDocRef = doc(this.firestore, `Candidato/${candidateId}/Lideres/${user.id}`);
      return deleteDoc(leaderDocRef);
    } else if (user.rol === 'testigo') {
      const witnessDocRef = doc(this.firestore, `Candidato/${candidateId}/Testigos/${user.id}`);
      return deleteDoc(witnessDocRef);
    }
  }

  getUser(id: string, candidateId: string, user: Leader | Witness): Observable<Leader[] | Witness[]> {
    if (user.rol === 'lider') {
      const leaderDocRef = doc(this.firestore, `Candidato/${candidateId}/Lideres/${id}`);
      return docData(leaderDocRef).pipe(map(leader => [leader])) as Observable<Leader[]>;
    } else if (user.rol === 'testigo') {
      const witnessDocRef = doc(this.firestore, `Candidato/${candidateId}/Testigos/${id}`);
      return docData(witnessDocRef).pipe(map(witness => [witness])) as Observable<Witness[]>;
    }
    return of([]);
  }

  updateUser(candidatoId: string, id: string, data: any, user: Leader | Witness): Promise<void> {

    if (user.rol === 'lider') {
      const leaderDocRef = doc(this.firestore, `Candidato/${candidatoId}/Lideres/${id}`);
      return updateDoc(leaderDocRef, data);
    } else if (user.rol === 'testigo') {
      const witnessDocRef = doc(this.firestore, `Candidato/${candidatoId}/Testigos/${id}`);
      return updateDoc(witnessDocRef, data);
    } else {
      throw new Error('Rol invalido');
    }
  }
}
