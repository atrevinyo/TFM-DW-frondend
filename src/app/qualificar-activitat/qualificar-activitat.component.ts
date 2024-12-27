import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Activitat, Alumne, Assignatura, Nota } from '../models/models';
import { CommonModule } from '@angular/common';
import { AssignaturesService } from '../services/assignatures.service';
import { ToastrService } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-qualificar-activitat',
  templateUrl: './qualificar-activitat.component.html',
  styleUrls: ['./qualificar-activitat.component.css'],
  standalone: true,
  imports: [CommonModule, MatTooltipModule]
})
export class QualificarActivitatComponent implements OnInit {
  @Input() activitat!: Activitat; // Activitat a qualificar
  @Input() alumnes: Alumne[] = []; // Llista d'alumnes
  @Input() assignatura!: Assignatura;
  @Output() onSave = new EventEmitter<void>();
  @Output() onTancar = new EventEmitter<void>();



  constructor ( private assignaturesService: AssignaturesService, private toastr: ToastrService) {}

  ngOnInit() {
    // Inicialitzar les notes a 0 si encara no existeixen per cada alumne i competència de l'activitat

    this.alumnes.forEach(alumne => {
      this.activitat.competencies.forEach(competencia => {
        const notaExist = alumne.notes.find(n => n.activitatId === this.activitat.id && n.competenciaId === competencia.codi);
        if (!notaExist) {
          // alumne.notes.push({ activitatId: this.activitat.id, competenciaId: competencia.codi, valor: 0 });
        }
      });
    });
  }

  // Gestiona el canvi de nota
  onNotaChange(alumne: Alumne, competenciaId: string, event: Event) {

    const inputValue = (event.target as HTMLInputElement).value;
    const valor = parseFloat(inputValue);

    // Comprova si la nota és vàlida i dins del rang
    if (valor >= 1 && valor <= 4) {
      const nota = alumne.notes.find(
        n => n.activitatId === this.activitat.id && n.competenciaId === competenciaId
      );
      if (nota) {
        nota.valor = valor; // Actualitza la nota existent
      } else {
        // Afegeix una nova nota si no existeix
        alumne.notes.push({ activitatId: this.activitat.id, competenciaId, valor });
      }
    } else {
      // Mostra un missatge d'error si la nota no és vàlida
      this.toastr.error('La nota ha de ser entre 1 i 4.');
      (event.target as HTMLInputElement).value = ''
    }


    // const valor = +(event.target as HTMLInputElement).value; // Converteix el valor de la nota a un nombre
    // const nota = alumne.notes.find(n => n.activitatId === this.activitat.id && n.competenciaId === competenciaId);
    // if (nota) nota.valor = valor;
  }

  // Funció per recuperar la nota específica d'un alumne i competència
  getNota(alumne: Alumne, competenciaId: string): number | string {
    const nota = alumne.notes.find(
      n => n.activitatId === this.activitat.id && n.competenciaId === competenciaId
    );
    return nota ? nota.valor : '';
  }

  guardarQualificacions() {
    // Lògica per guardar les qualificacions dins de l'assignatura
    this.onSave.emit(); // Notifiquem el component pare
  }


}
