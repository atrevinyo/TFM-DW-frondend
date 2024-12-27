import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Activitat, Assignatura, Competencia } from '../models/models'; // Import dels models
import { ActivitatFormModalComponent } from '../activitat-form-modal/activitat-form-modal.component'; // Import del formulari modal
import { QualificarActivitatComponent } from '../qualificar-activitat/qualificar-activitat.component';
import { AssignaturesService } from '../services/assignatures.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { AssignaturesStoreService } from '../services/assignaturesStore.service';

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

  constructor(private assignaturesService: AssignaturesService, private toastr: ToastrService, private assignaturesStoreService: AssignaturesStoreService) {};

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
    .subscribe({
        next: (assignaturaActualitzada) => {
            this.assignatura = assignaturaActualitzada;
            this.toastr.success('Activitat afegida correctament!');
        },
        error: (err) => {
            console.error('Error en afegir l\'activitat:', err);
            this.toastr.error('Error en afegir l\'activitat');
        }

    });

    this.assignaturesStoreService.setAssignaturaSeleccionada(this.assignatura)
    this.mostraFormulariModal = false; // Tanca el formulari modal
  }

  // Tanca el formulari modal sense guardar
  cancelFormulari() {
    this.mostraFormulariModal = false;
  }

  // Elimina una activitat
  eliminarActivitat(activitat: Activitat) {

    const confirmat = window.confirm(
      `Estàs segur que vols eliminar l'activitat "${activitat.nom}"?
      Aquesta acció també eliminarà totes les notes associades.`
    );

    if (confirmat) {
      // Elimina l'activitat
      this.assignatura.activitats = this.assignatura.activitats.filter(a => a.id !== activitat.id);


      this.assignatura.activitats = this.assignatura.activitats.filter(a => a.id !== activitat.id);
      this.menuObertId = null; // Tanca el menú contextual
      if (this.assignatura) {
        this.guardarAssignatura(true)
      }
    }
  }

  qualificarActivitat(activitat: Activitat) {
    this.activitatSeleccionada = activitat;
    this.mostraQualificarModal = true;
  }

   // Funció per tancar el modal de qualificació
   tancarQualificarModal() {
    this.mostraQualificarModal = false;
    if (this.assignatura) {
      this.guardarAssignatura(false)
    }
  }
  // Tanca el menú contextual si es fa clic fora d'ell
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if ( !targetElement.closest('.menu-contextual')) {
      this.menuObertId = null; // Tanca el menú si es fa clic fora
    }
  }

  guardarAssignatura(eliminada: boolean): void {
    this.assignaturesService.updateAssignatura(this.assignatura).subscribe({
      next: () => {
        if (eliminada)
          this.toastr.success('Assignatura eliminada correctament!');
        else this.toastr.success('Assignatura guardada correctament!');
      },
      error: (error) => {
        console.error('Error en guardar l\'assignatura:', error);
        this.toastr.error('No s\'ha pogut guardar l\'assignatura.');
      }
    });
  }

}
