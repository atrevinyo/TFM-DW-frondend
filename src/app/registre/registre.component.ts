import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registre.component.html',
})
export class RegistreComponent {
  registreForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);


  constructor(private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.registreForm = this.formBuilder.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {

    if (this.registreForm.valid) {
      const { nom, email, password } = this.registreForm.value;
      const user = { nom, email, password };

      this.authService.register(user).subscribe({
        next: (success) => {
          if (success) {
            this.toastr.success('Usuari registrat correctament!');
            this.router.navigate(['/login']);
          } else {
            this.toastr.error('Error en registrar l\'usuari');
          }
        },
        error: (err: HttpErrorResponse) => {

          const errorMessage = err.error?.error || err.message;
          console.error('Error en registrar l\'usuari:', err);
          if (errorMessage === 'El correu ja està registrat') {
            this.toastr.warning('Aquest correu ja està registrat. Prova amb un altre.');
          } else {
            this.toastr.error('Error inesperat en registrar l\'usuari');
          }
        }
      });
    } else {
      this.toastr.warning('Si us plau, omple tots els camps requerits');
    }
  }


}
