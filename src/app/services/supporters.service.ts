import { Injectable } from '@angular/core';
import { Firestore, doc, collection, setDoc } from '@angular/fire/firestore';
import { Supporter } from '../interfaces/supporters.interface';

@Injectable({
  providedIn: 'root'
})
export class SupportersService {

  constructor(private firestore: Firestore) {}

  async addUser(candidateId: string, leaderId: string, supporter: Supporter) {
    const leaderDocRef = doc(this.firestore, `Candidato/${candidateId}/Lideres/${leaderId}`);
    const supporterColRef = collection(leaderDocRef, 'Seguidores');
    console.log('leaderDocRef:', leaderDocRef);
    console.log('supporterColRef:', supporterColRef);
    console.log('supporter:', supporter);
    return setDoc(doc(supporterColRef, supporter.id), supporter);
  }
}
