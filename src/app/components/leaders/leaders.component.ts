import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadersService } from '@services/leaders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss']
})
export class LeadersComponent {
  createLeader: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private leaderService: LeadersService,
    private toastr: ToastrService) {

    this.createLeader = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required,]
    })
  }

  async newLeader() {
    this.submitted = true;

    const allFieldsEmpty = Object.values(this.createLeader.value).every(val => val === '');

    if (this.createLeader.invalid  || allFieldsEmpty) {
      return;
    }
    const leader: any = {
      id: this.createLeader.value.id,
      nombre: this.createLeader.value.nombre,
      apellido: this.createLeader.value.apellido,
      direccion: this.createLeader.value.direccion,
      telefono: this.createLeader.value.telefono,
    }

    try {

      const response = await this.leaderService.addLeader(leader);
      this.toastr.success('Guardado Correctamente', 'Lider');
      this.createLeader.reset();
      console.log(response);

    } catch (error) {

      console.error(error);
      this.toastr.error('Ocurrió un error al guardar', 'Error');
    }
  }
}
