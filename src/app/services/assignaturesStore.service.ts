

import { Injectable } from '@angular/core';
import { Assignatura } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AssignaturesStoreService {
  private assignatures: Assignatura[] = [];
  private assignaturaSeleccionada?: Assignatura;

  // Emmagatzema totes les assignatures
  setAssignatures(assignatures: Assignatura[]): void {
    this.assignatures = assignatures;
  }

  // Obté totes les assignatures
  getAssignatures(): Assignatura[] {
    return this.assignatures;
  }

  // Emmagatzema l'assignatura seleccionada
  setAssignaturaSeleccionada(assignatura: Assignatura): void {
    this.assignaturaSeleccionada = assignatura;
  }

  // Obté l'assignatura seleccionada
  getAssignaturaSeleccionada(): Assignatura | undefined {
    return this.assignaturaSeleccionada;
  }
}
