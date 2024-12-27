import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environments } from '../../environments/environments';
import { Assignatura, Materia } from '../models/models';

@Injectable({
  providedIn: 'root',
})

export class AssignaturesService {

  private baseUrl: string  = environments.baseURL;

  constructor(private http: HttpClient) { }

  // Mètode per obtenir totes les assignatures
  getAssignatures(): Observable<Assignatura[]> {
    return this.http.get<Assignatura[]>(`${ this.baseUrl }/assignatures`);
  }
   // Mètode per afegir una nova assignatura
  addAssignatura(assignatura: Assignatura): Observable<Assignatura> {
    console.log('Dades que s\'estan enviant:', assignatura);
    return this.http.post<Assignatura>(`${this.baseUrl}/assignatures`, assignatura)
      .pipe(
        tap((response) => {
          console.log('Assignatura afegida amb èxit:', response);
        }),
        catchError((error) => {
          console.error('Error en afegir l\'assignatura:', error);
          return throwError(() => new Error('Error en afegir l\'assignatura. Si us plau, revisa el backend.'));
        })
      );
  }
  // Mètode per actualitzar una assignatura existent
  updateAssignatura(updatedAssignatura: Assignatura): Observable<Assignatura> {

    return this.http.patch<Assignatura>(`${this.baseUrl}/assignatures/${updatedAssignatura.id}`, updatedAssignatura)
    .pipe(
      tap((response) => {
        console.log('Assignatura actualitzada amb èxit:', response);
      }),
      catchError((error) => {
        console.error('Error en actualitzar l\'assignatura:', error);
        return throwError(() => new Error('Error en actualitzar l\'assignatura. Si us plau, revisa el backend.'));
      })
    );
  }

  // Mètode per eliminar una assignatura
  deleteAssignaturaById(id: string): Observable<Assignatura> {
    return this.http.delete<Assignatura>(`${this.baseUrl}/assignatures/${id}`);
  }

  getMateries(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.baseUrl}/materies`);
  }

}
