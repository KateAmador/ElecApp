import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private firestore: AngularFirestore) { }

  addReport(placeId: string, tableId: string, table: number, votes: number, time: string): Promise<void> {
    return this.firestore.collection(`Reportes/${placeId}/Votos`).doc(tableId).set({
      mesa: table,
      votos: votes,
      hora: time
    });
  }

  getTableData(placeId: string) {
    return this.firestore.collection(`Reportes/${placeId}/Votos`, ref => ref.orderBy('mesa')).valueChanges();
  }

  async editVotes(placeId: string, tableId: string, votes: number, time: string): Promise<void> {
    const documentRef = this.firestore.collection(`Reportes/${placeId}/Votos`).doc(tableId);

    const doc = await documentRef.get().toPromise();
    if (doc?.exists) {
      const existingData: any = doc.data();
      const newData = {
        mesa: existingData.mesa,
        votos: votes,
        hora: time
      };
      console.log(newData);

      return documentRef.update(newData);
    } else {
      throw new Error(`El documento con ID ${tableId} no existe.`);

    }
  }
}
