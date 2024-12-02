import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  Alumne, Assignatura } from '../models/models';
import { AssignaturesService } from '../services/assignatures.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alumne-list',
  templateUrl: './alumne-list.component.html',
  styleUrls: ['./alumne-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AlumneListComponent implements OnInit {
  @Input() assignatura!: Assignatura;
  alumneSeleccionat?: Alumne;
  mostraFormulari: boolean = false;
  alumneForm: FormGroup;

  constructor(private fb: FormBuilder, private eRef: ElementRef, private assignaturesService: AssignaturesService, private toastr: ToastrService ) {
    this.alumneForm = this.fb.group({
      nom: ['']
    });
  }

  ngOnInit(): void {
    // Inicialitza mostrarMenu per cada alumne quan es carrega la llista
    this.assignatura.alumnes.forEach(alumne => {
      alumne.mostrarMenu = false;
    });
  }


  // Mostrar o amagar el menú de tres punts
  toggleMenu(alumne: Alumne): void {
    // Amaga el menú dels altres alumnes i alterna l'alumne seleccionat
    this.assignatura.alumnes.forEach(a => {
      if (a !== alumne) {
        a.mostrarMenu = false;
      }
    });
    alumne.mostrarMenu = !alumne.mostrarMenu;  // Alterna mostrarMenu per l'alumne seleccionat
  }

  // Mostra el formulari per afegir un nou alumne
  afegirAlumne() {
    this.alumneSeleccionat = undefined;
    this.mostraFormulari = true;
    this.alumneForm.reset();
  }

  // Mostra el formulari per editar un alumne
  editarAlumne(alumne: Alumne) {
    this.alumneSeleccionat = { ...alumne };
    this.alumneForm.patchValue(alumne);
    this.mostraFormulari = true;
  }

  // Guarda l'alumne (afegir o actualitzar)
  guardarAlumne() {
    if (this.alumneForm.valid) {
      const nom = this.alumneForm.get('nom')?.value;

      console.log("ABANS DE FER EL RES", this.assignatura)

      if (this.alumneSeleccionat) {
        // Actualització de l'alumne existent
        const index = this.assignatura.alumnes.findIndex(a => a.id === this.alumneSeleccionat!.id);
        if (index !== -1) {
          this.assignatura.alumnes[index] = { ...this.assignatura.alumnes[index], nom };
        }
      } else {
        // Afegir nou alumne
        console.log("ABANS DE FER EL PUSH", this.assignatura)

        // const { userId, ...restAssignatura } = this.assignatura; // Extreu la propietat userId
        // this.assignatura = restAssignatura; // Assigna l'objecte sense userId

        this.assignatura.alumnes.push({ id: "", nom, notes: [] });

        console.log("DESPRES FER EL PUSH", this.assignatura)

      }

      this.assignaturesService.updateAssignatura(this.assignatura)
      .subscribe({
          next: (assignaturaActualitzada) => {
              this.assignatura = assignaturaActualitzada;
              this.toastr.success('Alumne afegit correctament!');
          },
          error: (err) => {
              console.error('Error en afegir l\'alumne:', err);
              this.toastr.error('Error en afegir l\'alumne');
          }
      });

      this.mostraFormulari = false;
      this.alumneForm.reset();
    }
  }

  // Cancel·la l'operació d'afegir o editar
  cancelar() {
    this.mostraFormulari = false;
    this.alumneForm.reset();
  }

  // Elimina un alumne de l'assignatura
  eliminarAlumne(alumne: Alumne) {
    this.assignatura.alumnes = this.assignatura.alumnes.filter(a => a.id !== alumne.id);
  }

  // Listener per detectar clics fora del menú
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const clickedInside = this.eRef.nativeElement.contains(targetElement);

    if (!clickedInside) {
      // Tanca tots els menús quan es fa clic fora del component
      this.assignatura.alumnes.forEach(alumne => {
        // alumne.mostrarMenu = false;
      });
    }
  }
}
