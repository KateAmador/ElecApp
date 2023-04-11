import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-supporters',
  templateUrl: './supporters.component.html',
  styleUrls: ['./supporters.component.scss']
})
export class SupportersComponent {
  createSupporter: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder) {
    this.createSupporter = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required,]
    })
  }

  newSupporter(){
    this.submitted = true;

    if(this.createSupporter.invalid){
      return;
    }
    console.log(this.createSupporter);
  }
}
