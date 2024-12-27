import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService)  {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: (isLoggedIn) => {
      if (isLoggedIn) {
        this.toastr.success('Login correcte');
        this.router.navigate(['/dashboard']);
      } else {
        this.toastr.error('Credencials incorrectes');
      }
    },
    error: (error) => {
      console.error('Error inesperat en el login:', error);
      this.toastr.error('Hi ha hagut un error inesperat');
    }
  });
}

 // Mètode per redirigir a la pàgina de registre
 goToRegister() {
  this.router.navigate(['/registre']);
}

}
