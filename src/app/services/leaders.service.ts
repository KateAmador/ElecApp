import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import Leader from '../interfaces/leader.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LeadersService {


  constructor(private firestore: Firestore) { }

  // addLeader(leader: Leader) {
  //   const leaderRef = collection(this.firestore, 'Lideres');
  //   return addDoc(leaderRef, leader);
  // }

  addLeaderToCandidato(candidatoId: string, leader: Leader) {
    const candidatoDocRef = doc(this.firestore, `Candidato/${candidatoId}`);
    const lideresColRef = collection(candidatoDocRef, 'Lideres');
    return addDoc(lideresColRef, leader);
  }


  addLeader(id: string, leader: Leader) {
    const candidatoDocRef = doc(this.firestore, `Candidato/${id}`);
    const lideresCollectionRef = collection(candidatoDocRef, 'Lideres');
    return addDoc(lideresCollectionRef, leader);
  }

  getLeaders(): Observable<Leader[]> {
    const leaderRef = collection(this.firestore, 'Lideres');
    return collectionData(leaderRef, { idField: 'id' }) as Observable<Leader[]>;
  }

  deleteLeader(leader: Leader) {
    const leaderDocRef = doc(this.firestore, `Lideres/${leader.id}`);
    return deleteDoc(leaderDocRef);
  }

  getLeader(id: string): Observable<Leader> {
    const leaderDocRef = doc(this.firestore, `Lideres/${id}`);
    return docData(leaderDocRef) as Observable<Leader>;
  }

  updateLeader(id: string, data: any): Promise<any> {
    const leaderDocRef = doc(this.firestore, `Lideres/${id}`);
    return updateDoc(leaderDocRef, data);
  }
}
