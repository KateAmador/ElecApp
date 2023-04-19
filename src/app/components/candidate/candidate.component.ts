import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent {
  firestore: Firestore = inject(Firestore)
  items$: Observable<any[]>;
  candidateId: string = 'candidatoID';
  hasCandidate = false;

  constructor(
    private router: Router) {

    const aCollection = collection(this.firestore, 'Candidato')
    this.items$ = collectionData(aCollection);
  }

  ngOnInit(): void {
    this.findCandidate();
  }

  async findCandidate(){

    try {
      this.hasCandidate = true;
      const docRef = doc(this.firestore, 'Candidato', this.candidateId);
      const docSnap = await getDoc(docRef);
      this.hasCandidate = docSnap.exists();
    } catch (error) {
      console.error(error);
    }
  }

  newRedirect(){
    this.router.navigate(['/crear-candidato']);
  }

  editRedirect(){
    this.router.navigate(['/editar-candidato', this.candidateId]);
  }
}





