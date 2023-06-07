import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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
}
