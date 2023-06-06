import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private firestore: AngularFirestore) { }

  addReport(placeId: string, tableId: string, votos: number, hora: string) {
    this.firestore.collection(`Reportes/${placeId}/Votos`).doc(tableId).set({
      votos,
      hora
    });
  }

  getTableData(placeId: string) {
    return this.firestore.collection(`Reportes/${placeId}/Votos`).valueChanges();
  }
}
