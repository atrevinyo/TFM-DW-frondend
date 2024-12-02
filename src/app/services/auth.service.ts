import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environments } from '../../environments/environments';
import { User } from '../models/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${ environments.baseURL }/auth`;
  private tokenKey = 'access_token';
  private user?: User;

  constructor(private http: HttpClient, private router: Router) {}

  // Funció de login
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ user: User; access_token: string }>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.access_token) {
            // Guarda el token i la informació de l'usuari al localStorage
            localStorage.setItem(this.tokenKey, response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }),
        map(response => !!response.access_token),
        catchError((error) => {
          console.error('Error en el login:', error);
          return of(false); // Retorna `false` en cas d'error per indicar que el login ha fallat
        })
      );
  }

  register(user: { nom: string; email: string; password: string }): Observable<boolean> {
    return this.http.post<{ user: User; statusCode: number; message: string; }>(`${this.baseUrl}/register`, user)
      .pipe(
        map(response => {
          console.log('Resposta del backend al registre:', response);
          return response.statusCode === 201;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error en el registre:', error);
          return throwError(() => new Error(error.error.message || 'Error en registrar l\'usuari'));
        })
      );
  }

  // Funció de logout
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }


  // Comprova si l'usuari està autenticat
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
