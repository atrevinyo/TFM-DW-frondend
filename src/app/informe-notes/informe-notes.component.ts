import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Alumne, Assignatura, Competencia } from '../models/models';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-informe-notes',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './informe-notes.component.html',
  styleUrls: []
})
export class InformeNotesComponent implements OnInit {

  @Input()assignatura!: Assignatura;
  alumnes: Alumne[] = [];
  competencias: Competencia[] = [];



  ngOnInit(): void {
    if (this.assignatura) {
      // Obtenim els alumnes de l'assignatura
      this.alumnes = this.assignatura.alumnes.sort((a, b) => a.nom.localeCompare(b.nom));
      this.competencias = this.getCompetenciesUnificades();
    }

    }

  // Agrupa totes les competències de les activitats de l'assignatura
  getCompetenciesUnificades(): Competencia[] {
    const allCompetencies = this.assignatura.activitats.flatMap(
      activitat => activitat.competencies
    );
    const uniqueCompetencies = allCompetencies.filter(
      (competencia, index, self) =>
        index === self.findIndex(c => c.codi === competencia.codi)
    );
    return uniqueCompetencies;
  }

  // Calcula la nota mitjana d'un alumne per una competència específica
getNotaMitjana(alumne: Alumne, competenciaId: string): string | number {
  const notes = alumne.notes.filter(
    nota => nota.competenciaId === competenciaId && nota.valor !== null && nota.valor !== undefined
  );

  if (notes.length === 0) {
    return ''; // Retorna espai en blanc per notes buides
  }

  const total = notes.reduce((sum, nota) => sum + nota.valor, 0);
  return Math.round((total / notes.length) * 100) / 100; // Arrodonim a 2 decimals
}

// Calcula la nota total de totes les competències per un alumne
getTotalMitjanaAlumne(alumne: Alumne): string | number {
  const notes = alumne.notes.filter(nota => nota.valor !== null && nota.valor !== undefined);

  if (notes.length === 0) {
    return ''; // Retorna espai en blanc per alumnes sense notes
  }

  const total = notes.reduce((sum, nota) => sum + nota.valor, 0);
  return Math.round((total / notes.length) * 100) / 100;
}

// Calcula la mitjana d'una competència entre tots els alumnes
getMitjanaCompetencia(competenciaId: string): string | number {
  const notes = this.alumnes.flatMap(alumne =>
    alumne.notes.filter(nota => nota.competenciaId === competenciaId && nota.valor !== null && nota.valor !== undefined)
  );

  if (notes.length === 0) {
    return ''; // Retorna espai en blanc si no hi ha notes per a aquesta competència
  }

  const total = notes.reduce((sum, nota) => sum + nota.valor, 0);
  return Math.round((total / notes.length) * 100) / 100;
}
}
