import { Injectable } from '@angular/core';
import { Firestore, doc, collection, setDoc, addDoc, collectionData, deleteDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Supporter } from '../interfaces/supporters.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportersService {

  constructor(private firestore: Firestore) { }

  async addSupporter(candidateId: string, leaderId: any, supporter: Supporter) {
    const supportersColRef = collection(this.firestore, `Candidato/${candidateId}/Lideres/${leaderId}/Seguidores`);
    return addDoc(supportersColRef, supporter);
  }

  getSupporters(candidateId: string, leaderId: any): Observable<Supporter[]> {
    const supportersRef = collection(this.firestore, `Candidato/${candidateId}/Lideres/${leaderId}/Seguidores`);
    return collectionData(supportersRef, { idField: 'id' }) as Observable<Supporter[]>;
  }

  async deleteSupporter(candidateId: string, leaderId: any, supporter: Supporter) {
    const supporterDocRef = doc(this.firestore, `Candidato/${candidateId}/Lideres/${leaderId}/Seguidores/${supporter.id}`);
    return deleteDoc(supporterDocRef);
  }

  getSupporter(id: string, candidateId: string, leaderId: any): Observable<Supporter> {
    const supporterDocRef = doc(this.firestore, `Candidato/${candidateId}/Lideres/${leaderId}/Seguidores/${id}`);
    return docData(supporterDocRef) as Observable<Supporter>;
}

  updateSupporter(candidatoId: string, leaderId: any, id: string, data: any): Promise<void> {
    const supporterDocRef = doc(this.firestore, `Candidato/${candidatoId}/Lideres/${leaderId}/Seguidores/${id}`);
    return updateDoc(supporterDocRef, data);
  }
}


