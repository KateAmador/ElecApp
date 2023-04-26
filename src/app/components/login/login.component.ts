import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formLogin: FormGroup;

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private router: Router) {

    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  onSubmit() {

    this.userService.login(this.formLogin.value)
      .then(response => {
        console.log(response);
        this.router.navigate(['/inicio']);
      })
      .catch(error => console.log(error));
  }
}
