import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Assignatura, Materia } from '../models/models';
import { AssignaturesService } from '../services/assignatures.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assignatura-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assignatura-form.component.html',
  styleUrls: ['./assignatura-form.component.css']
})

export class AssignaturaFormComponent implements OnInit {
  @Input() assignatura: Assignatura | null = null;
  @Input() materies: Materia[] = [];
  @Output() onAssignaturaAfegida = new EventEmitter<Assignatura>(); // Envia el nom de la nova assignatura
  @Output() onTancar = new EventEmitter<void>(); // Emet l'event per tancar el modal

  assignaturaForm: FormGroup;

  constructor(private formBuilder: FormBuilder,  private assignaturesService: AssignaturesService, private toastr: ToastrService) {

    this.assignaturaForm = this.formBuilder.group({
      id: [],
      nom: ['', Validators.required],
      materia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("AL ENTRAR AL FORMULARI:", this.assignatura)
    if (this.assignatura) {
     this.assignaturaForm.patchValue({
       id: this.assignatura.id,
       nom: this.assignatura.nom,
       materia: this.assignatura.materia
     });
   }
  }

  carregarMateries() {
    this.assignaturesService.getMateries().subscribe({
      next: (materies) => this.materies = materies,
      error: (err) => console.error('Error carregant les matèries:', err)
    });
  }


  afegirAssignatura(): void {
    if (this.assignaturaForm.valid) {
      const { nom, materia } = this.assignaturaForm.value;

      if (!nom) {
        this.toastr.warning("El nom de l'assignatura és obligatori.");
        return;
      }

      if (!materia) {
        this.toastr.warning('Seleccionar la matèria és obligatori.');
        return;
      }

      const novaAssignatura: Assignatura = {
        id: this.assignatura?.id || '', // Si és una edició, utilitza l'id existent
        nom,
        materia,
        alumnes: this.assignatura?.alumnes || [],
        activitats: this.assignatura?.activitats || []
      };

      console.log("COMPROVO SI TE MATERIA:", novaAssignatura)
      this.onAssignaturaAfegida.emit(novaAssignatura);
      this.tancarModal();
    } else {
      this.toastr.error('Si us plau, omple tots els camps requerits.');
    }


    // if (this.assignaturaForm.valid) {
    //   this.onAssignaturaAfegida.emit(this.assignaturaForm.value);
    //   this.tancarModal();
    // }
  }

  tancarModal(): void {
    this.onTancar.emit();
  }

  compareMateries(materia1: Materia, materia2: Materia): boolean {
    return materia1 && materia2 ? materia1._id === materia2._id : false;
  }

}
