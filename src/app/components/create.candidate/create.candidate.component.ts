import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateCandidateService } from '@services/create-candidate.service';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import Candidate from 'src/app/interfaces/candidate.interface';

@Component({
  selector: 'app-create.candidate',
  templateUrl: './create.candidate.component.html',
  styleUrls: ['./create.candidate.component.scss']
})
export class CreateCandidateComponent {
  firestore: Firestore = inject(Firestore);
  createCandidate: FormGroup;
  submitted = false;
  loading = false;
  disable = false;
  hasId = false;
  id: string | null;

  constructor(
    private fb: FormBuilder,
    private createCandidateService: CreateCandidateService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute) {

    this.createCandidate = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      partido: ['', Validators.required],
      numero: ['', Validators.required],
      email: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.updateCandidate();
    this.unableField();
  }

  async addEdit() {
    this.submitted = true;

    const allFieldsEmpty = Object.values(this.createCandidate.value).every(val => val === '');

    if (this.createCandidate.invalid || allFieldsEmpty) {
      return;
    }

    if (this.id === null) {
      this.newCandidate();
    } else {
      this.update(this.id);
    }

  }

  async newCandidate() {
    const candidate = this.getValues();
    this.disable = true;

    try {
      this.loading = true;
      const response = await this.createCandidateService.addCandidate(candidate);
      this.toastr.success('Guardado Correctamente', 'Candidato');
      this.router.navigate(['/candidato']);
      this.createCandidate.reset();
      this.loading = false;
      console.log(response);

    } catch (error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Ocurrió un error al guardar', 'Error');
    }
    this.disable = false;
  }

  update(id: string) {

    const candidate = this.getValues();
    this.loading = true;
    this.createCandidateService.updateCandidate(id, candidate).then(() => {
      this.loading = false;
      this.toastr.success('Modificado correctamente', 'Candidato');
      this.createCandidate.reset();
    });
    this.router.navigate(['/candidato']);
    this.disable = false;
  }

  updateCandidate() {
    if (this.id !== null) {
      this.loading = true;
      this.createCandidateService.getCandidate(this.id).subscribe(data => {
        this.loading = false;
        console.log(data.nombre);
        this.createCandidate.setValue({
          documento: data.documento,
          nombre: data.nombre,
          apellido: data.apellido,
          partido: data.partido,
          numero: data.numero,
          email: data.email
        })
      })
    }
  }

  getValues(): Candidate {
    const candidate: Candidate = {
      documento: this.createCandidate.value.documento,
      nombre: this.capitalizeFirstLetter(this.createCandidate.value.nombre),
      apellido: this.capitalizeFirstLetter(this.createCandidate.value.apellido),
      email: this.createCandidate.value.email,
      partido: this.createCandidate.value.partido,
      numero: this.createCandidate.value.numero
    };
    return candidate;
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
}
