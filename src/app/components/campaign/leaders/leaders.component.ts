import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Leader } from 'src/app/interfaces/leader.interface';
import { UsersService } from '@services/users.service';
import { LoginService } from '@services/login.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss']
})
export class LeadersComponent {

  firestore: Firestore = inject(Firestore);
  createLeader: FormGroup;
  submitted = false;
  loading = false;
  leaders: any[] = [];
  id: string | null;
  titulo: string;
  boton: string;
  backButtonVisible = false;
  hasCandidate = false;
  candidateId: string = 'candidatoID';

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private loginService: LoginService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private location: Location) {

    this.createLeader = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      email: ['', Validators.required],
      contraseña: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    this.titulo = this.id ? 'Editar Lider' : 'Crear Lider';
    this.boton = this.id ? 'Editar' : 'Agregar';
  }

  ngOnInit(): void {
    this.getLeaders(this.candidateId);
    this.updateLeader();
    this.findCandidate();
    this.backButton();
  }

  async addEdit() {
    this.submitted = true;

    const allFieldsEmpty = Object.values(this.createLeader.value).every(val => val === '');

    if (this.createLeader.invalid || allFieldsEmpty) {
      return;
    }

    if (this.id === null) {
      this.newLeader();
    } else {
      this.update(this.id);
    }
  }

  async newLeader() {
    const leader = this.getValues();
    try {
      this.loading = true;
      const userCredential = await this.loginService.register(leader.email, leader.contraseña);
      const uid = userCredential.user.uid;
      leader.uid = uid;
      const response = await this.userService.addUser(this.candidateId, leader);

      this.toastr.success('Guardado Correctamente', 'Lider');
      this.createLeader.reset();
      this.loading = false;
      console.log(response);

    } catch (error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Ocurrió un error al guardar', 'Error');
    }
  }

  getLeaders(candidateId: string) {
    const leader = this.getValues();
    this.userService.getUsers(candidateId, leader).subscribe(leaders => {
      this.leaders = leaders;
    });
  }

  async deleteLeader(leader: Leader) {
    if (confirm('¿Estás seguro que deseas eliminar al líder?')) {
      const response = await this.userService.deleteUser(leader, this.candidateId);
      this.toastr.success('Se ha eliminado correctamente', 'Lider');
      console.log(response);
    }
  }

  update(liderId: string) {
    const leader = this.getValues();
    this.loading = true;
    this.userService.updateUser(this.candidateId, liderId, leader, leader)
      .then(() => {
        this.loading = false;
        this.createLeader.reset();
        this.router.navigate(['/campaña/lideres']);
        this.toastr.success('Modificado correctamente', 'Lider');
      })
      .catch((error) => {
        console.error('Error actualizando líder: ', error);
        this.loading = false;
      });
  }

  updateLeader() {
    const leader = this.getValues();
    if (this.id !== null) {
      this.loading = true;
      this.userService.getUser(this.id, this.candidateId, leader).subscribe(data => {
        this.loading = false;
        if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          console.log(firstItem.nombre);
          this.createLeader.setValue({
            documento: firstItem.documento,
            nombre: firstItem.nombre,
            apellido: firstItem.apellido,
            direccion: firstItem.direccion,
            telefono: firstItem.telefono,
            fechaNacimiento: firstItem.fechaNacimiento || '',
            genero: firstItem.genero,
            email: firstItem.email,
            contraseña: firstItem.contraseña || ''
          });
        } else {
          console.log('No se encontró ningún usuario');
        }
      });
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

  goBack(){
    this.location.back();
  }

  getValues(): Leader {
    const leader: Leader = {
      documento: this.createLeader.value.documento,
      nombre: this.capitalizeFirstLetter(this.createLeader.value.nombre),
      apellido: this.capitalizeFirstLetter(this.createLeader.value.apellido),
      direccion: this.createLeader.value.direccion,
      telefono: this.createLeader.value.telefono,
      fechaNacimiento: this.createLeader.value.fechaNacimiento,
      email: this.createLeader.value.email,
      contraseña: this.createLeader.value.contraseña,
      genero: this.createLeader.value.genero,
      rol: 'lider'
    };
    return leader;
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
