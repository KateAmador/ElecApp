import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-witnesses',
  templateUrl: './witnesses.component.html',
  styleUrls: ['./witnesses.component.scss']
})
export class WitnessesComponent {
  createWitness: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder) {
    this.createWitness = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      mesa: ['', Validators.required],
      puesto: ['', Validators.required]
    })
  }

  newWitness(){
    this.submitted = true;

    if(this.createWitness.invalid){
      return;
    }
    console.log(this.createWitness);
  }
}
