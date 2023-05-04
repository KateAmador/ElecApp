import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import Witness from '../interfaces/witnesses.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WitnessesService {

  constructor(private firestore: Firestore) { }

  // addWitness(candidateId: string, witness: Witness) {
  //   const candidateDocRef = doc(this.firestore, `Candidato/${candidateId}`);
  //   const witnessColRef = collection(candidateDocRef, 'Testigos');
  //   return addDoc(witnessColRef, witness);
  // }

  addWitness(candidateId: string, witness: Witness) {
    const candidateDocRef = doc(this.firestore, `Candidato/${candidateId}`);
    const witnessesColRef = collection(candidateDocRef, 'Testigos');
    return setDoc(doc(witnessesColRef, witness.uid), witness);
  }

  getWitnesses(candidateId: string): Observable<Witness[]> {
    const candidateRef = doc(this.firestore, 'Candidato', candidateId);
    const witnessRef = collection(candidateRef, 'Testigos');
    return collectionData(witnessRef, { idField: 'id' }) as Observable<Witness[]>;
  }

  deleteWitness(witness: Witness, candidateId: string) {
    const witnessDocRef = doc(this.firestore, `Candidato/${candidateId}/Testigos/${witness.id}`);
    return deleteDoc(witnessDocRef);
  }

  getWitness(id: string, candidateId: string): Observable<Witness> {
    const witnessDocRef = doc(this.firestore, `Candidato/${candidateId}/Testigos/${id}`);
    return docData(witnessDocRef) as Observable<Witness>;
  }

  updateWitness(candidatoId: string, witnessId: string, data: any): Promise<void> {
    const witnessDocRef = doc(this.firestore, `Candidato/${candidatoId}/Testigos/${witnessId}`);
    return updateDoc(witnessDocRef, data);
  }
}
