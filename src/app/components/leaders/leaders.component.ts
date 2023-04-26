import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadersService } from '@services/leaders.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import Leader from 'src/app/interfaces/leader.interface';
import { UsersService } from '@services/users.service';

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
    private leaderService: LeadersService,
    private userService: UsersService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router) {

    this.createLeader = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required]
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
    const password = Math.random().toString(36).substring(2, 8);
    const leader: any = {
      documento: this.createLeader.value.documento,
      nombre: this.createLeader.value.nombre,
      apellido: this.createLeader.value.apellido,
      direccion: this.createLeader.value.direccion,
      telefono: this.createLeader.value.telefono,
      email: this.createLeader.value.email,
      password: password,
      rol: 'lider'
    }



    try {
      this.loading = true;
      const response = await this.leaderService.addLeader('candidatoID', leader);
      this.userService.register(leader.email, leader.password).then(response => {
        console.log(response);
      })
      .catch(error => console.log(error));
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

  getLeaders(candidatoId: string) {
    this.leaderService.getLeaders(candidatoId).subscribe(leaders => {
      this.leaders = leaders;
    });
  }

  async deleteLeader(leader: Leader) {
    if (confirm('¿Estás seguro que deseas eliminar al líder?')) {
      const response = await this.leaderService.deleteLeader(leader, this.candidateId);
      this.toastr.success('Se ha eliminado correctamente', 'Lider');
    }
  }

  update(liderId: string) {
    const lider: any = {
      documento: this.createLeader.value.documento,
      nombre: this.createLeader.value.nombre,
      apellido: this.createLeader.value.apellido,
      direccion: this.createLeader.value.direccion,
      telefono: this.createLeader.value.telefono,
    };
    this.loading = true;
    this.leaderService.updateLeader(this.candidateId, liderId, lider)
      .then(() => {
        this.loading = false;
        this.toastr.success('Modificado correctamente', 'Lider');
        this.createLeader.reset();
        this.router.navigate(['/lideres']);
      })
      .catch((error) => {
        console.error('Error actualizando líder: ', error);
        this.loading = false;
      });
  }

  updateLeader() {
    if (this.id !== null) {
      this.loading = true;
      this.leaderService.getLeader(this.id, this.candidateId).subscribe(data => {
        this.loading = false;
        console.log(data.nombre);
        this.createLeader.setValue({
          documento: data.documento,
          nombre: data.nombre,
          apellido: data.apellido,
          direccion: data.direccion,
          telefono: data.telefono,
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

  backRedirect(){
    this.router.navigate(['/lideres']);
  }
}
