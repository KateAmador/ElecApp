import { Injectable } from '@angular/core';
import 'firebase/firestore'
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import Leader from '../interfaces/leader.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LeadersService {

  constructor(private firestore: Firestore) { }

  addLeader(candidateId: string, leader: Leader) {
    const candidatoDocRef = doc(this.firestore, `Candidato/${candidateId}`);
    const lideresColRef = collection(candidatoDocRef, 'Lideres');
    return addDoc(lideresColRef, leader);
  }

  getLeaders(candidateId: string): Observable<Leader[]> {
    const candidatoRef = doc(this.firestore, 'Candidato', candidateId);
    const leaderRef = collection(candidatoRef, 'Lideres');
    return collectionData(leaderRef, { idField: 'id' }) as Observable<Leader[]>;
  }

  deleteLeader(leader: Leader, candidateId: string) {
    const leaderDocRef = doc(this.firestore, `Candidato/${candidateId}/Lideres/${leader.id}`);
    return deleteDoc(leaderDocRef);
  }

  getLeader(id: string, candidateId: string): Observable<Leader> {
    const leaderDocRef = doc(this.firestore, `Candidato/${candidateId}/Lideres/${id}`);
    return docData(leaderDocRef) as Observable<Leader>;
  }

  updateLeader(candidatoId: string, liderId: string, data: any): Promise<void> {
    const liderDocRef = doc(this.firestore, `Candidato/${candidatoId}/Lideres/${liderId}`);
    return updateDoc(liderDocRef, data);
  }
}
