import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  [x: string]: any;

  constructor(private firestore: AngularFirestore) { }

  searchForLeaderGender(genre: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const query = this.firestore.collection('Candidato')
        .get()
        .pipe(
          switchMap((candidatoSnap: QuerySnapshot<any>) => {
            const promises = candidatoSnap.docs.map(candidatoDoc => {
              return candidatoDoc.ref.collection('Lideres')
                .where('genero', '==', genre)
                .get();
            });
            return combineLatest(promises);
          })
        );

      query.subscribe((snapshots: QuerySnapshot<any>[]) => {
        const total = snapshots.reduce((acc, snapshot) => acc + snapshot.size, 0);
        resolve(total);
      }, (error) => {
        reject(error);
      });
    });
  }


  searchForGender(genre: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const query = this.firestore.collectionGroup('Seguidores', ref =>
        ref.where('genero', '==', genre)
      );

      query.get().subscribe((querySnapshot: QuerySnapshot<any>) => {
        const total = querySnapshot.size;
        resolve(total);
      }, (error) => {
        reject(error);
      });
    });
  }

  getUsersAges() {
    return this.firestore.collection('Candidato').get();
  }
}






