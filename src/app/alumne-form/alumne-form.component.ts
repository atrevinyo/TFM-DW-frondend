import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Models
interface Alumne {
  id: string;
  nom: string;
}

@Component({
  selector: 'app-alumne-form',
  templateUrl: './alumne-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AlumneFormComponent {
  @Input() alumne?: Alumne;
  @Output() save = new EventEmitter<Alumne>();
  @Output() cancel = new EventEmitter<void>();

  alumneForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.alumneForm = this.fb.group({
      nom: ['', Validators.required]
    });
  }

  ngOnChanges() {
    // Actualitza el formulari si es proporciona un alumne existent
    if (this.alumne) {
      this.alumneForm.patchValue(this.alumne);
    }
  }

  // Emissió de l'esdeveniment per guardar l'alumne
  guardar() {
    if (this.alumneForm.valid) {
      const alumne: Alumne = { ...this.alumne, ...this.alumneForm.value };
      this.save.emit(alumne);
    }
  }

  // Emissió de l'esdeveniment per cancel·lar l'operació
  cancelar() {
    this.cancel.emit();
  }
}
