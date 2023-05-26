import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SupportersService } from '@services/supporters.service';
import { ToastrService } from 'ngx-toastr';
import { Supporter } from 'src/app/interfaces/supporters.interface';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-supporters',
  templateUrl: './supporters.component.html',
  styleUrls: ['./supporters.component.scss']
})
export class SupportersComponent {

  candidateId: string = 'candidatoID';
  createSupporter: FormGroup;
  supporters: any[] = [];
  titulo: string | undefined;
  id: string | null;
  boton: string | undefined;
  hasId = false;
  loading = false;
  submitted = false;
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private supporterService: SupportersService,
    private toastr: ToastrService,
    private auth: Auth,
    private router: Router,
    private aRoute: ActivatedRoute,
    private location: Location) {

    this.createSupporter = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', this.isAdult],
      genero: ['', Validators.required],
      email: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.titulo = this.id ? 'Editar Seguidor' : 'Crear Seguidor';
    this.boton = this.id ? 'Editar' : 'Agregar';
  }

  ngOnInit(): void {
    this.getSupporters();
    this.updateSupporter();
    this.unableField();
    this.disableCalendar();
  }

  async addEdit() {
    this.submitted = true;

    const allFieldsEmpty = Object.values(this.createSupporter.value).every(val => val === '');

    if (this.createSupporter.invalid || allFieldsEmpty) {
      return;
    }

    if (this.id === null) {
      this.newSupporter();
    } else {
      this.update(this.id);
    }
  }

  async newSupporter() {
    const supporter = this.getValues();
    const candidateId = 'candidatoID';
    const leaderId = this.auth.currentUser?.uid;

    try {
      this.loading = true
      const response = await this.supporterService.addSupporter(candidateId, leaderId, supporter);

      this.toastr.success('Guardado Correctamente', 'Lider');
      this.createSupporter.reset();
      this.loading = false;
      console.log(response);

    } catch (error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Ocurrió un error al guardar', 'Error');
    }
  }

  getSupporters() {
    const candidateId = 'candidatoID';
    const leaderId = this.auth.currentUser?.uid;
    this.supporterService.getSupporters(candidateId, leaderId).subscribe((supporters) => {
      this.supporters = supporters;
      console.log(leaderId);
    });
  }

  async deleteSupporter(supporter: Supporter) {
    const candidateId = 'candidatoID';
    const leaderId = this.auth.currentUser?.uid;
    if (confirm('¿Estás seguro que deseas eliminar el seguidor?')) {
      const response = await this.supporterService.deleteSupporter(candidateId, leaderId, supporter);
      this.toastr.success('Se ha eliminado correctamente', 'Seguidor');
      console.log(response);
    }
  }

  update(supporterId: string) {
    const supporter = this.getValues();
    const candidateId = 'candidatoID';
    const leaderId = this.auth.currentUser?.uid;
    this.loading = true;

    this.supporterService.updateSupporter(candidateId, leaderId, supporterId, supporter)
      .then(() => {
        this.loading = false;
        this.createSupporter.reset();
        this.router.navigate(['/campaña/seguidores']);
        this.toastr.success('Modificado correctamente', 'Seguidor');
      })
      .catch((error) => {
        console.error('Error actualizando líder: ', error);
        this.loading = false;
      });
  }


  updateSupporter() {
    const candidateId = 'candidatoID';
    const leaderId = this.auth.currentUser?.uid;

    if (this.id !== null) {

      this.loading = true;

      this.supporterService.getSupporter(this.id, candidateId, leaderId).subscribe(data => {
        this.loading = false;

        console.log(data.nombre);

        this.createSupporter.setValue({
          documento: data.documento,
          nombre: data.nombre,
          apellido: data.apellido,
          direccion: data.direccion,
          telefono: data.telefono,
          fechaNacimiento: data.fechaNacimiento || '',
          genero: data.genero,
          email: data.email
        });
      });
    }
  }

  getValues(): Supporter {
    const supporter: Supporter = {
      documento: this.createSupporter.value.documento,
      nombre: this.capitalizeFirstLetter(this.createSupporter.value.nombre),
      apellido: this.capitalizeFirstLetter(this.createSupporter.value.apellido),
      direccion: this.capitalizeFirstLetter(this.createSupporter.value.direccion),
      telefono: this.createSupporter.value.telefono,
      fechaNacimiento: this.createSupporter.value.fechaNacimiento,
      email: this.createSupporter.value.email,
      genero: this.createSupporter.value.genero,
      rol: 'seguidor'
    };
    return supporter;
  }

  isAdult(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const birthDate = new Date(control.value);
      const today = new Date();
      const minimumDate = new Date();
      minimumDate.setFullYear(today.getFullYear() - 18);

      if (birthDate > minimumDate) {
        return { menorDeEdad: true };
      }
    }

    return null;
  }

  disableCalendar() {
    const fechaActual = new Date();
    fechaActual.setFullYear(fechaActual.getFullYear() - 18);
    this.maxDate = fechaActual.toISOString().split('T')[0];
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  unableField() {
    if (this.aRoute.snapshot.paramMap.has('id')) {
      this.hasId = true;
    }
  }

  goBack() {
    this.location.back();
  }
}
