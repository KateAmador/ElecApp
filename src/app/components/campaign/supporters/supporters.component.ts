import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '@services/login.service';
import { SupportersService } from '@services/supporters.service';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Supporter } from 'src/app/interfaces/supporters.interface';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-supporters',
  templateUrl: './supporters.component.html',
  styleUrls: ['./supporters.component.scss']
})
export class SupportersComponent {

  firestore: Firestore = inject(Firestore);
  candidateId: string = 'candidatoID';
  leaderId: string = 'ocd9AAQDngR04ZHRby4gnaHQ35r2'
  createSupporter: FormGroup;
  supporters: any[] = [];
  //titulo: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private supporterService: SupportersService,
    private loginService: LoginService,
    private toastr: ToastrService,
    private auth: Auth) {

    this.createSupporter = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      email: ['', Validators.required]
    })

  }

  ngOnInit(): void {

  }

  async newSupporter() {
    const supporter = this.getValues();
    const candidateId = 'candidatoID';
    const leaderId = 'ocd9AAQDngR04ZHRby4gnaHQ35r2';
    //const userId = this.auth.currentUser?.uid;
    //console.log('userId:', userId);
    try {
      this.loading = true
      const response = await this.supporterService.addUser(candidateId, leaderId, supporter);

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

  getValues(): Supporter {
    const supporter: Supporter = {
      documento: this.createSupporter.value.documento,
      nombre: this.createSupporter.value.nombre,
      apellido: this.createSupporter.value.apellido,
      direccion: this.createSupporter.value.direccion,
      telefono: this.createSupporter.value.telefono,
      fechaNacimiento: this.createSupporter.value.fechaNacimiento,
      email: this.createSupporter.value.email,
      genero: this.createSupporter.value.genero,
      rol: 'seguidor'
    };
    return supporter;
  }
}
