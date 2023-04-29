import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SupportersService } from '@services/supporters.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supporters',
  templateUrl: './supporters.component.html',
  styleUrls: ['./supporters.component.scss']
})
export class SupportersComponent {
  candidateId: string = 'candidatoID';
  createSupporter: FormGroup;
  submitted = false;
  leaders: any[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private supporterService: SupportersService) {


    this.createSupporter = this.fb.group({
      lider: ['', Validators.required],
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getLeaders(this.candidateId);
  }

  getLeaders(candidatoId: string) {
    this.supporterService.getLeaders(candidatoId).subscribe(leaders => {
      this.leaders = leaders;
    });
  }


}
