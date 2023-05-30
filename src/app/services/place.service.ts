import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Place } from '../interfaces/place.interface';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private firestore: Firestore) { }

  async addPlace(place: Place) {
    const placeRef = collection(this.firestore, `Puestos`);
    return addDoc(placeRef, place);
  }

  getPlaces(): Observable<Place[]> {
    const placeRef = collection(this.firestore, `Puestos`);
    return collectionData(placeRef, { idField: 'id' }) as Observable<Place[]>;
  }

  async deletePlace(place: Place) {
    const placeDocRef = doc(this.firestore, `Puestos/${place.id}`);
    return deleteDoc(placeDocRef);
  }

  getPlace(id: string): Observable<Place> {
    const placeDocRef = doc(this.firestore, `Puestos/${id}`);
    return docData(placeDocRef) as Observable<Place>;
}

  updatePlace(id: string, data: any): Promise<void> {
    const placeDocRef = doc(this.firestore, `Puestos/${id}`);
    return updateDoc(placeDocRef, data);
  }
}
