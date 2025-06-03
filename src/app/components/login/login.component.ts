import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit(): void {
    const { email, password } = this.loginForm.value;

    this.loginService.login(email, password).subscribe((res) => {
      if (res) {
        this.router.navigate(['/home']);
        localStorage.setItem(
          'jwt',
          'Bearer eyJhbGciOiJI6IkpXJIUzI1NiIsInR5cCI6IkpXVCJ9'
        );
      } else {
        this.toastr.error('Login ou senha inválidos');
      }
    });
  }
}
