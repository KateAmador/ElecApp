import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Witness } from 'src/app/interfaces/witnesses.interface';
import { UsersService } from '@services/users.service';
import { LoginService } from '@services/login.service';
import { Location } from '@angular/common';
import { PlaceService } from '@services/place.service';
import { Place } from 'src/app/interfaces/place.interface';

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
  hasId = false;
  passwordValidators;
  maxDate: string = '';
  itemsPerPage = 10;
  currentPage = 1;
  places: Place[] = [];


  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private loginService: LoginService,
    private placeService: PlaceService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private location: Location) {

    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.titulo = this.id ? 'Editar Testigo' : 'Crear Testigo';
    this.boton = this.id ? 'Editar' : 'Agregar';
    this.passwordValidators = this.id === null ? [Validators.required] : [];

    this.createWitness = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      puesto: ['', Validators.required],
      fechaNacimiento: ['', this.isAdult],
      genero: ['', Validators.required],
      email: ['', Validators.required],
      contraseña: ['', this.passwordValidators]
    })
  }

  ngOnInit(): void {
    this.getWitnesses(this.candidateId);
    this.updateWitness();
    this.findCandidate();
    this.unableField();
    this.disableCalendar();
    this.getPlaces();
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
    const witness = this.getValues();
    try {
      this.loading = true;

      const userCredential = await this.loginService.register(witness.email, witness.contraseña);
      const uid = userCredential.user.uid;
      witness.uid = uid;
      witness.contraseña = "";
      const response = await this.userService.addUser(this.candidateId, witness);

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
    const witness = this.getValues();
    this.userService.getUsers(candidateId, witness).subscribe(witness => {
      this.witnesses = witness;
    });
  }

  getPlaces() {
    this.placeService.getPlaces().subscribe(place => {
      this.places = place;
    });
  }

  async deleteWitness(witness: Witness) {
    if (confirm('¿Estás seguro que deseas eliminar al testigo?')) {
      const response = await this.userService.deleteUser(witness, this.candidateId);
      this.toastr.success('Se ha eliminado correctamente', 'Testigo');
      console.log(response);
    }
  }

  update(witnessId: string) {
    const witness = this.getValues();
    this.loading = true;
    this.userService.updateUser(this.candidateId, witnessId, witness, witness)
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
    const witness = this.getValues();
    if (this.id !== null) {
      this.loading = true;
      this.userService.getUser(this.id, this.candidateId, witness).subscribe(data => {
        this.loading = false;
        if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          console.log(firstItem.nombre);
          if ('puesto' in firstItem) {
            this.createWitness.setValue({
              documento: firstItem.documento,
              nombre: firstItem.nombre,
              apellido: firstItem.apellido,
              direccion: firstItem.direccion,
              telefono: firstItem.telefono,
              fechaNacimiento: firstItem.fechaNacimiento,
              genero: firstItem.genero,
              puesto: firstItem.puesto,
              email: firstItem.email,
              contraseña: ""
            })
          } else {
            console.log('El objeto no es un Testigo');
          }
        } else {
          console.log('No se encontró ningún usuario');
        }
      });
    }
  }

  getValues(): Witness {
    const witness: Witness = {
      documento: this.createWitness.value.documento,
      nombre: this.capitalizeFirstLetter(this.createWitness.value.nombre),
      apellido: this.capitalizeFirstLetter(this.createWitness.value.apellido),
      direccion: this.capitalizeFirstLetter(this.createWitness.value.direccion),
      telefono: this.createWitness.value.telefono,
      puesto: this.capitalizeFirstLetter(this.createWitness.value.puesto),
      fechaNacimiento: this.createWitness.value.fechaNacimiento,
      genero: this.createWitness.value.genero,
      email: this.createWitness.value.email,
      contraseña: this.createWitness.value.contraseña,
      rol: 'testigo'
    };
    return witness;
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

  disableCalendar(){
    const fechaActual = new Date();
    fechaActual.setFullYear(fechaActual.getFullYear() - 18);
    this.maxDate = fechaActual.toISOString().split('T')[0];
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

    capitalizeFirstLetter(value: string): string {
    const words = value.split(' ');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
  }

  unableField() {
    if (this.aRoute.snapshot.paramMap.has('id')) {
      this.hasId = true;
    }
  }

  goBack(){
    this.location.back();
  }

  get totalPages(): number {
    return Math.ceil(this.witnesses.length / this.itemsPerPage);
  }
}
