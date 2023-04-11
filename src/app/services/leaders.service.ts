import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import Leader from '../interfaces/leader.interface';

@Injectable({
  providedIn: 'root'
})
export class LeadersService {

  constructor(private firestore: Firestore) {}

  addLeader(leader: Leader){
    const leaderRef = collection(this.firestore, 'Lideres');
    return addDoc(leaderRef, leader);
  }

}



