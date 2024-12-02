import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';


import { AssignaturesService } from '../services/assignatures.service';
import { Assignatura, Activitat } from '../models/models'; // Import dels models
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenusuperiorComponent } from '../menusuperior/menusuperior.component';
import { AssignaturaCardComponent } from '../assignatura-card/assignatura-card.component';




@Component({
  selector: 'app-assignatura-list',
  standalone: true,
  templateUrl: './assignatura-list.component.html',
  styleUrl: './assignatura-list.component.css',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AssignaturaCardComponent]
})
export class AssignaturaListComponent implements OnInit {

  @Input() assignatures: Assignatura[] = [];
  @Input() menuObert: boolean = false;  // Controla si el menú està obert
  @Output() onAssignaturaSelected = new EventEmitter<Assignatura>();
  @Output() onEliminarAssignatura = new EventEmitter<Assignatura>();  // Emet l'esdeveniment per eliminar assignatura
  @Output() onEditarAssignatura = new EventEmitter<Assignatura>();  // Emet l'esdeveniment per editar assignatura
  @Output() onToggleMenu = new EventEmitter<void>();  // Emet quan es fa clic per obrir/tancar el menú


  assignaturaForm = new FormGroup({});
  menuObertId: string | null = null;  // ID de l'assignatura que té el menú obert

  constructor(private route: ActivatedRoute, private assignaturesService: AssignaturesService) { }

  ngOnInit(): void {


    // this.assignaturesService.getAssignatures()
    //   .subscribe(assignatures => this.assignatures = assignatures);
  }

 // Notifica el pare per obrir o tancar el menú
 toggleMenu(assignaturaId: string): void {
  this.menuObertId = this.menuObertId === assignaturaId ? null : assignaturaId;
  this.onToggleMenu.emit();

}

  // Selecciona una assignatura per mostrar-ne els detalls
  seleccionarAssignatura(assignatura: Assignatura) {
    this.onAssignaturaSelected.emit(assignatura); // Enviar l'assignatura seleccionada
  }

  eliminarAssignatura(assignatura: Assignatura): void {
    this.onEliminarAssignatura.emit(assignatura);  // Emet l'assignatura que es vol eliminar
  }

  editarAssignatura(assignatura: Assignatura): void {
    this.onEditarAssignatura.emit(assignatura);  // Emet l'assignatura que es vol editar
  }


// Detecta clics fora del component per tancar el menú
@HostListener('document:click', ['$event'])
onClickOutside(event: Event): void {
  const target = event.target as HTMLElement;

  if (!target.closest('.menu-button') && !target.closest('.menu-container')) {
    this.onToggleMenu.emit();
  }
}

}
