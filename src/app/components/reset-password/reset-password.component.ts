import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '@services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form: FormGroup;
  submitted = false;


  constructor(
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService) {

      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      })
  }

  onSubmit() {
    this.submitted = true;
    const email = this.form.controls['email'].value;

    this.loginService.resetPassword(email)
      .then(() => {
        console.log('Correo de recuperación enviado');
        this.toastr.success('Revise su correo', 'Email Enviado', { positionClass: 'toast-top-right'});
        this.router.navigate(['/inicio-sesion']);
      })
      .catch((error) => {
        console.error('Error al enviar correo de recuperación', error);
      });
  }
}
