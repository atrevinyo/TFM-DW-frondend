import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  Alumne, Assignatura } from '../models/models';
import { AssignaturesService } from '../services/assignatures.service';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-alumne-list',
  templateUrl: './alumne-list.component.html',
  styleUrls: ['./alumne-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatMenuModule, MatIconModule],
})
export class AlumneListComponent implements OnInit {
  @Input() assignatura!: Assignatura;
  alumneSeleccionat?: Alumne;
  mostraFormulari: boolean = false;
  alumneForm: FormGroup;

  constructor(private fb: FormBuilder, private eRef: ElementRef, private assignaturesService: AssignaturesService, private toastr: ToastrService, private cdr: ChangeDetectorRef  ) {
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


        // this.assignatura = restAssignatura; // Assigna l'objecte sense userId

        this.assignatura.alumnes.push({ id: uuidv4(), nom, notes: [] });

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

       // Crear un nou objecte per a la detecció de canvis
       this.assignatura = { ...this.assignatura };

      // Opcional: forçar la detecció de canvis
      this.cdr.detectChanges();

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
    this.assignaturesService.updateAssignatura(this.assignatura)
    .subscribe({
        next: (assignaturaActualitzada) => {
            this.assignatura = assignaturaActualitzada;
            this.toastr.success('Alumne eliminat correctament!');
        },
        error: (err) => {
            console.error('Error en afegir l\'alumne:', err);
            this.toastr.error('Error a l\'elimnar alumne l\'alumne');
        }
    });


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


  importarAlumnes(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Els alumneshan d' estar a la primera fulla del fitxer
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const alumnesData = XLSX.utils.sheet_to_json(worksheet);

        // Convertim les dades llegides a la estructura JSON
        const nousAlumnes = alumnesData.map((row: any) => ({
          id: uuidv4(),
          nom: row.Nom || '', // Només si la columna es diu "Nom"
          notes: [] // Inicialitzem notes buides
        }));

        // Afegim els alumnes a l'assignatura
        this.assignatura.alumnes.push(...nousAlumnes);

        this.actualitzarAssignatura();

        console.log('Alumnes importats:', nousAlumnes);
      };

      reader.readAsArrayBuffer(file);
    }
  }

  actualitzarAssignatura(): void {
    this.assignaturesService
      .updateAssignatura(this.assignatura)
      .subscribe({
        next: () => this.toastr.success('Alumnes importats correctament!'),
        error: (err) => this.toastr.error('Error important alumnes:', err),
      });
  }

}
