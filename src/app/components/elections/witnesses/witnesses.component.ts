import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { WitnessesService } from '@services/witnesses.service';
import { ToastrService } from 'ngx-toastr';
import Witness from 'src/app/interfaces/witnesses.interface';
import { UsersService } from '@services/users.service';

@Component({
  selector: 'app-witnesses',
  templateUrl: './witnesses.component.html',
  styleUrls: ['./witnesses.component.scss']
})
export class WitnessesComponent {
  firestore: Firestore = inject(Firestore);
  candidateId: string = 'candidatoID';
  createWitness: FormGroup;
  witnesses: any[] = [];
  submitted = false;
  loading = false;
  hasCandidate = false;
  id: string | null;
  titulo: string;
  boton: string;
  backButtonVisible = false;

  constructor(
    private fb: FormBuilder,
    private witnessService: WitnessesService,
    private userService: UsersService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router) {


    this.createWitness = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      mesa: ['', Validators.required],
      puesto: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      email: ['', Validators.required],
      contraseña: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.titulo = this.id ? 'Editar Testigo' : 'Crear Testigo';
    this.boton = this.id ? 'Editar' : 'Agregar';
  }

  ngOnInit(): void {
    this.getWitnesses(this.candidateId);
    this.updateWitness();
    this.findCandidate();
    this.backButton();
  }

  async addEdit() {
    this.submitted = true;

    const allFieldsEmpty = Object.values(this.createWitness.value).every(val => val === '');

    if (this.createWitness.invalid || allFieldsEmpty) {
      return;
    }

    if (this.id === null) {
      this.newWitness();
    } else {
      this.update(this.id);
    }
  }

  async newWitness() {
    const witness: any = {
      documento: this.createWitness.value.documento,
      nombre: this.createWitness.value.nombre,
      apellido: this.createWitness.value.apellido,
      direccion: this.createWitness.value.direccion,
      telefono: this.createWitness.value.telefono,
      mesa: this.createWitness.value.mesa,
      puesto: this.createWitness.value.puesto,
      fechaNacimiento: this.createWitness.value.fechaNacimiento,
      email: this.createWitness.value.email,
      contraseña: this.createWitness.value.contraseña,
      rol: 'testigo'
    }

    try {
      this.loading = true;

      const userCredential = await this.userService.register(witness.email, witness.contraseña);
      const uid = userCredential.user.uid;
      witness.uid = uid;
      const response = await this.witnessService.addWitness(this.candidateId, witness);

      this.toastr.success('Guardado Correctamente', 'Testigo');
      this.createWitness.reset();
      this.loading = false;
      console.log(response);

    } catch (error) {

      console.error(error);
      this.loading = false;
      this.toastr.error('Ocurrió un error al guardar', 'Error');
    }
  }

  getWitnesses(candidateId: string) {
    this.witnessService.getWitnesses(candidateId).subscribe(witness => {
      this.witnesses = witness;
    });
  }

  async deleteWitness(witness: Witness) {
    if (confirm('¿Estás seguro que deseas eliminar al testigo?')) {
      const response = await this.witnessService.deleteWitness(witness, this.candidateId);
      this.toastr.success('Se ha eliminado correctamente', 'Testigo');
    }
  }

  update(witnessId: string) {
    const witness: any = {
      documento: this.createWitness.value.documento,
      nombre: this.createWitness.value.nombre,
      apellido: this.createWitness.value.apellido,
      direccion: this.createWitness.value.direccion,
      telefono: this.createWitness.value.telefono,
      mesa: this.createWitness.value.mesa,
      puesto: this.createWitness.value.puesto
    };
    this.loading = true;
    this.witnessService.updateWitness(this.candidateId, witnessId, witness)
      .then(() => {
        this.loading = false;
        this.createWitness.reset();
        this.router.navigate(['/elecciones/testigos']);
        this.toastr.success('Modificado correctamente', 'Testigo');
      })
      .catch((error) => {
        console.error('Error actualizando testigo: ', error);
        this.loading = false;
      });
  }



  updateWitness() {
    if (this.id !== null) {
      this.loading = true;
      this.witnessService.getWitness(this.id, this.candidateId).subscribe(data => {
        this.loading = false;
        console.log(data.nombre);
        this.createWitness.setValue({
          documento: data.documento,
          nombre: data.nombre,
          apellido: data.apellido,
          direccion: data.direccion,
          telefono: data.telefono,
          fechaNacimiento: data.fechaNacimiento,
          mesa: data.mesa,
          puesto: data.puesto,
          email: data.email,
          contraseña: data.contraseña
        })
      })
    }
  }

  async findCandidate() {
    try {
      this.hasCandidate = true;
      const docRef = doc(this.firestore, 'Candidato', this.candidateId);
      const docSnap = await getDoc(docRef);
      this.hasCandidate = docSnap.exists();
    } catch (error) {
      console.error(error);
    }
  }

  backButton() {
    if (this.aRoute.snapshot.paramMap.has('id')) {
      this.backButtonVisible = true;
    }
  }
}
