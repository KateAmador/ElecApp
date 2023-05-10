import { Injectable } from '@angular/core';
import { Firestore, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import Candidate from '../interfaces/candidate.interface';
import { Observable } from 'rxjs';
import Leader from '../interfaces/candidate.interface';

@Injectable({
  providedIn: 'root'
})
export class CreateCandidateService {
  private candidateDocId = 'candidatoID';

  constructor(private firestore: Firestore) { }

  addCandidate(candidate: Candidate) {
    const candidateRef = doc(this.firestore, 'Candidato', this.candidateDocId);
    return setDoc(candidateRef, candidate);
  }

  getCandidate(id: string): Observable<Candidate> {
    const candidateDocRef = doc(this.firestore, `Candidato/${id}`);
    return docData(candidateDocRef) as Observable<Leader>;
  }

  updateCandidate(id: string, data: any): Promise<any> {
    const candidateDocRef = doc(this.firestore, `Candidato/${id}`);
    return updateDoc(candidateDocRef, data);
  }
}
