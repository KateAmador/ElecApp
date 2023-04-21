import { Injectable } from '@angular/core';
import { addDoc, collectionData, docData } from '@angular/fire/firestore';
import { Firestore, doc, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import Leader from '../interfaces/leader.interface';
import Supporter from '../interfaces/supporters.interface';

@Injectable({
  providedIn: 'root'
})
export class SupportersService {

  constructor(private firestore: Firestore) { }

  getLeaders(candidateId: string): Observable<Leader[]> {
    const candidatoRef = doc(this.firestore, 'Candidato', candidateId);
    const leaderRef = collection(candidatoRef, 'Lideres');
    return collectionData(leaderRef, { idField: 'id' }) as Observable<Leader[]>;
  }

  addSupporter(candidateId: string, leaderId: Leader, supporter: Supporter) {
    const liderDocRef = doc(this.firestore, `Candidato/${candidateId}/Lideres/${leaderId}`);
    const supporterColRef = collection(liderDocRef, 'Seguidores');
    return addDoc(supporterColRef, supporter);
  }

  getLeader(id: string, candidateId: string): Observable<Leader> {
    const leaderDocRef = doc(this.firestore, `Candidato/${candidateId}/Lideres/${id}`);
    return docData(leaderDocRef) as Observable<Leader>;
  }
}
