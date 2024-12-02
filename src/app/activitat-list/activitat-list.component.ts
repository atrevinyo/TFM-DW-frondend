import { Component, HostListener, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Activitat, Assignatura, Competencia } from '../models/models'; // Import dels models
import { ActivitatFormModalComponent } from '../activitat-form-modal/activitat-form-modal.component'; // Import del formulari modal
import { QualificarActivitatComponent } from '../qualificar-activitat/qualificar-activitat.component';
import { AssignaturesService } from '../services/assignatures.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-activitat-list',
  templateUrl: './activitat-list.component.html',
  styleUrls: ['./activitat-list.component.css'],
  standalone: true,
  imports: [CommonModule, ActivitatFormModalComponent,DatePipe, QualificarActivitatComponent, MatMenuModule, MatIconModule ],
})
export class ActivitatListComponent {



  @Input() assignatura!: Assignatura;
  activitatDesplegada: string | null = null;
  menuObertId: string | null = null;
  mostraFormulariModal: boolean = false; // Controla la visibilitat del formulari modal
  activitatSeleccionada?: Activitat; // Activitat seleccionada per editar
  mostraQualificarModal = false;  // Estat del modal de qualificació

  constructor(private assignaturesService: AssignaturesService) {};

  // Controla el desplegament d'una activitat
  toggleActivitat(id: string) {
    this.activitatDesplegada = this.activitatDesplegada === id ? null : id;
  }

  // Controla el desplegament del menú contextual
  toggleMenuContextual(id: string) {
    this.menuObertId = this.menuObertId === id ? null : id;
  }

  // Obre el formulari modal per afegir una nova activitat
  afegirActivitat() {
    this.activitatSeleccionada = undefined;
    this.mostraFormulariModal = true;
  }

  // Obre el formulari modal per editar una activitat existent
  editarActivitat(activitat: Activitat) {
    this.activitatSeleccionada = activitat;
    this.mostraFormulariModal = true;
    this.menuObertId = null; // Tanca el menú contextual
  }

  // Gestiona l'acció de guardar (afegir o actualitzar) una activitat
  guardarActivitat(novaActivitat: Activitat) {
    if (this.activitatSeleccionada) {
      // Actualitza l'activitat existent
      const index = this.assignatura.activitats.findIndex(a => a.id === novaActivitat.id);
      if (index !== -1) {
        this.assignatura.activitats[index] = novaActivitat;
      }
    } else {
      // Afegeix una nova activitat
      this.assignatura.activitats.push(novaActivitat);
    }
    this.assignaturesService.updateAssignatura(this.assignatura)
    this.mostraFormulariModal = false; // Tanca el formulari modal
  }

  // Tanca el formulari modal sense guardar
  cancelFormulari() {
    this.mostraFormulariModal = false;
  }

  // Elimina una activitat
  eliminarActivitat(activitat: Activitat) {
    this.assignatura.activitats = this.assignatura.activitats.filter(a => a.id !== activitat.id);
    this.menuObertId = null; // Tanca el menú contextual
  }

  qualificarActivitat(activitat: Activitat) {
    this.activitatSeleccionada = activitat;
    this.mostraQualificarModal = true;
  }

   // Funció per tancar el modal de qualificació
   tancarQualificarModal() {
    this.mostraQualificarModal = false;
  }
  // Tanca el menú contextual si es fa clic fora d'ell
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if ( !targetElement.closest('.menu-contextual')) {
      this.menuObertId = null; // Tanca el menú si es fa clic fora
    }
  }
}
