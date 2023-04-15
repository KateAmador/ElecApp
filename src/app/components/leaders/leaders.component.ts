import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadersService } from '@services/leaders.service';
import { ToastrService } from 'ngx-toastr';
import Leader from 'src/app/interfaces/leader.interface';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss']
})
export class LeadersComponent {
  createLeader: FormGroup;
  submitted = false;
  loading = false;
  leaders: any[] = [];
  id: string | null;
  titulo = 'Agregar Lider';

  constructor(
    private fb: FormBuilder,
    private leaderService: LeadersService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router) {

    this.createLeader = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required,]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit(): void {
    this.getLeaders();
    this.updateLeader();
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
    const leader: any = {
      documento: this.createLeader.value.documento,
      nombre: this.createLeader.value.nombre,
      apellido: this.createLeader.value.apellido,
      direccion: this.createLeader.value.direccion,
      telefono: this.createLeader.value.telefono,
    }

    try {
      this.loading = true;
      const response = await this.leaderService.addLeaderToCandidato('candidatoId', leader);
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

  getLeaders() {
    this.leaderService.getLeaders().subscribe(leaders => {
      this.leaders = leaders;
    });
  }

  async deleteLeader(leader: Leader) {
    if (confirm('¿Estás seguro que deseas eliminar al líder?')) {
      const response = await this.leaderService.deleteLeader(leader);
      this.toastr.success('Se ha eliminado correctamente', 'Lider');
    }
  }

  update(id: string) {

    const leader: any = {
      documento: this.createLeader.value.documento,
      nombre: this.createLeader.value.nombre,
      apellido: this.createLeader.value.apellido,
      direccion: this.createLeader.value.direccion,
      telefono: this.createLeader.value.telefono,
    }
    this.loading = true;
    this.leaderService.updateLeader(id, leader).then(() => {
      this.loading = false;
      this.toastr.success('Mdificado correctamente', 'Lider');
      this.createLeader.reset();
    })
    this.router.navigate(['/lideres']);
  }

  updateLeader() {
    this.titulo = 'Editar Lider'
    if (this.id !== null) {
      this.loading = true;
      this.leaderService.getLeader(this.id).subscribe(data => {
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


}
