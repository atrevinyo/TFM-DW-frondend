import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Activitat, Competencia } from '../models/models';

@Component({
  selector: 'app-activitat-form-modal',
  templateUrl: './activitat-form-modal.component.html',
  styleUrls: ['./activitat-form-modal.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ActivitatFormModalComponent {
  @Input() activitat?: Activitat;
  @Input() availableCompetencies: Competencia[] = [];
  @Output() onSave = new EventEmitter<Activitat>();
  @Output() onCancel = new EventEmitter<void>();

  activitatForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.activitatForm = this.fb.group({
      nom: ['', Validators.required],
      descripcio: ['', Validators.required],
      data: ['', Validators.required],
      competencies: [[]] // Array per gestionar les competències seleccionades
    });
  }

  ngOnInit(): void {
    if (this.activitat) {
      this.activitatForm.patchValue({
        nom: this.activitat.nom,
        descripcio: this.activitat.descripcio,
        data: this.activitat.data,
        competencies: this.activitat.competencies.map(comp => comp.codi)
      });
    }
  }

  // Gestiona la selecció o deselecció d'una competència
  toggleCompetencia(competenciaId: string) {
    const selectedCompetencies = this.activitatForm.get('competencies')?.value as string[];
    if (selectedCompetencies.includes(competenciaId)) {
      this.activitatForm.patchValue({
        competencies: selectedCompetencies.filter(id => id !== competenciaId)
      });
    } else {
      this.activitatForm.patchValue({
        competencies: [...selectedCompetencies, competenciaId]
      });
    }
  }

  // Verifica si una competència està seleccionada
  isCompetenciaSelected(competenciaId: string): boolean {
    return (this.activitatForm.get('competencies')?.value as string[]).includes(competenciaId);
  }

  // Funció per guardar o afegir una activitat
  onSubmit(): void {
    if (this.activitatForm.valid) {
      const formValue = this.activitatForm.value;

      const newActivitat: Activitat = {
        id: this.activitat ? this.activitat.id : new Date().getTime().toString(),
        nom: formValue.nom,
        descripcio: formValue.descripcio,
        data: new Date(formValue.data),
        competencies: this.availableCompetencies.filter(comp => formValue.competencies.includes(comp.codi))
      };

      this.onSave.emit(newActivitat);
      this.closeModal();
    }
  }

  // Funció per tancar el formulari
  closeModal(): void {
    this.onCancel.emit();
  }
}
