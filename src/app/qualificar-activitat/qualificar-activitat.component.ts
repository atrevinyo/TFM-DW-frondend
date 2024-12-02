import { Component, Input, OnInit } from '@angular/core';
import { Activitat, Alumne, Nota } from '../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qualificar-activitat',
  templateUrl: './qualificar-activitat.component.html',
  styleUrls: ['./qualificar-activitat.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class QualificarActivitatComponent implements OnInit {
  @Input() activitat!: Activitat; // Activitat a qualificar
  @Input() alumnes: Alumne[] = []; // Llista d'alumnes

  ngOnInit() {
    // Inicialitzar les notes a 0 si encara no existeixen per cada alumne i competència de l'activitat
    this.alumnes.forEach(alumne => {
      this.activitat.competencies.forEach(competencia => {
        const notaExist = alumne.notes.find(n => n.activitatId === this.activitat.id && n.competenciaId === competencia.codi);
        if (!notaExist) {
          alumne.notes.push({ activitatId: this.activitat.id, competenciaId: competencia.codi, valor: 0 });
        }
      });
    });
  }

  // Gestiona el canvi de nota
  onNotaChange(alumne: Alumne, competenciaId: string, event: Event) {
    const valor = +(event.target as HTMLInputElement).value; // Converteix el valor de la nota a un nombre
    const nota = alumne.notes.find(n => n.activitatId === this.activitat.id && n.competenciaId === competenciaId);
    if (nota) nota.valor = valor;
  }

  // Funció per recuperar la nota específica d'un alumne i competència
  getNota(alumne: Alumne, competenciaId: string): number {
    return alumne.notes.find(n => n.activitatId === this.activitat.id && n.competenciaId === competenciaId)?.valor || 0;
  }
}
