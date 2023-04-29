import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formLogin: FormGroup;
  submitted = false;

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {

    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    this.submitted = true;
    this.userService.login(this.formLogin.value)
      .then(response => {
        console.log(response);
        this.router.navigate(['/inicio']);
      })
      .catch(error => {
        console.log(error);
        this.toastr.warning('Email o contraseña invalido', 'Credenciales Incorrectas', { positionClass: 'toast-top-right'});
      });
  }
}
