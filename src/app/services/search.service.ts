import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private firestore: AngularFirestore) { }

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
}
