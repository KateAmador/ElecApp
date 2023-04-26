import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@services/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form: FormGroup;


  constructor(
    private userService: UsersService,
    private router: Router
  ) {
    this.form = new FormGroup({
      email: new FormControl()
    })

  }

  onSubmit() {
    const email = this.form.controls['email'].value;

    this.userService.resetPassword(email)
      .then(() => {
        console.log('Correo de recuperación enviado');
        this.router.navigate(['/inicio-sesion']);
      })
      .catch((error) => {
        console.error('Error al enviar correo de recuperación', error);
        // Aquí puedes agregar lógica adicional como mostrar un mensaje de error al usuario
      });
  }
}
