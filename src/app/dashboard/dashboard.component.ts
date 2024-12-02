import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignatura, Materia } from '../models/models';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AssignaturesService } from '../services/assignatures.service';
import { MenusuperiorComponent } from '../menusuperior/menusuperior.component';
import { AssignaturaListComponent } from '../assignatura-list/assignatura-list.component';
import { AssignaturaFormComponent } from '../assignatura-form/assignatura-form.component';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { AssignaturesStoreService } from '../services/assignaturesStore.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MenusuperiorComponent, AssignaturaListComponent,  AssignaturaFormComponent],
})
export class DashboardComponent implements OnInit {

  public assignatures: Assignatura[] = [];
  materies: Materia[] = [];
  // assignaturaSeleccionada?: Assignatura;
  modalObert = false;
  assignaturaAEditar: Assignatura | null = null;
  mostrarAssignaturaList: boolean = true;


  constructor(private assignaturesService: AssignaturesService, private router: Router,  private route: ActivatedRoute, private toastr: ToastrService, private cdr: ChangeDetectorRef, private assignaturesStoreService:AssignaturesStoreService ) { }

  ngOnInit(): void {
    this.assignaturesService.getAssignatures()
      .subscribe(assignatures => this.assignatures = assignatures);

      this.route.url.subscribe((urlSegment) => {
        // Si la ruta és exactament `/dashboard`, mostra la llista d'assignatures
        this.mostrarAssignaturaList = this.router.url === '/dashboard';
      });
      this.carregarMateries()
    }


  // Obre el modal per afegir o editar una assignatura
  obrirModalPerAfegirAssignatura(): void {
    this.assignaturaAEditar = null;  // Passa null per indicar que afegirem una assignatura nova
    this.modalObert = true;  // Obre el modal
  }

  // Tanca el modal
  tancarModal(): void {
    this.modalObert = false;
    // this.assignaturaAEditar = null;
  }

  // Observer reutilitzable per a addAssignatura i updateAssignatura
  observer = {
    next: (response: Assignatura) => {
      if (this.assignaturaAEditar?.id) {
        // Si estem editant una assignatura existent


        const index = this.assignatures.findIndex(a => a.id === this.assignaturaAEditar?.id);
        if (index !== -1) {
          this.assignatures[index] = { ...response };

          console.log("ASSIGNATURA ACTUALITZADA; ",this.assignatures)

          this.toastr.success('Assignatura actualitzada correctament!');
        }
      } else {
        // Si estem afegint una assignatura nova
        if (response.id) { // Comprova que l'assignatura té un _id retornat pel backend
          this.assignatures = [...this.assignatures,  response ];

          console.log("ASSIGNATURA NOVA AFEGIDA; ",this.assignatures)

          this.toastr.success('Assignatura afegida correctament!');
        }
      }
      this.tancarModal();
      this.assignaturaAEditar = null;
    },
    error: (error: any) => {
      console.error('Error en la petició:', error);
      this.toastr.error('Error en la petició');
    },
    complete: () => {
      console.log('Operació completada');
    }
  };



  // Afegeix una nova assignatura
  afegirAssignatura(assignatura: Assignatura): void {
    console.log("ESTIC AFEGINNT!!!!!")

     // Obtenir el `userId` del `localStorage`
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;


    if (!userId) {
      console.error("No s'ha trobat el userId");
      return;
    }

    const novaAssignatura: Assignatura = {
      id: "", //(this.assignatures.length + 1).toString(),
      nom: assignatura.nom,
      materia: assignatura.materia,
      alumnes: [],
      activitats: [],
      // userId: "",   //userId // Afegeix el `userId` a la nova assignatura
    };
    // this.assignatures = [...this.assignatures, novaAssignatura];
    this.assignaturesService.addAssignatura(novaAssignatura).subscribe(this.observer);
  }


  guardarAssignaturaEditada(assignatura: Assignatura): void {
    console.log("ESTIC EDITANT!!!!!")
    this.assignaturesService.updateAssignatura(assignatura).subscribe(this.observer)
    // const index = this.assignatures.findIndex(a => a.id === assignatura.id);
    // if (index !== -1) {
      // this.assignatures[index] = assignatura; // Actualitza assignatura a la llista
    // }

  }

  // Mètode per guardar una assignatura (sigui nova o editada)
  guardarAssignatura(assignatura: Assignatura): void {

    console.log("AL MOMENT DE GUARDAR:", assignatura)

    if (assignatura?.id) {
      // Si estem editant, actualitzem l'assignatura
      this.guardarAssignaturaEditada(assignatura);
    } else {
      // Si estem afegint una nova assignatura
      this.afegirAssignatura(assignatura);
    }
  }
  // Edició d'una assignatura
  editarAssignatura(assignatura: Assignatura): void {
    this.assignaturaAEditar = { ...assignatura };
    this.modalObert = true;
  }

  deleteObserver = {
    next: () => {
      this.toastr.success('Assignatura eliminada correctament!');
    },
    error: (error: any) => {
      console.error('Error en eliminar l\'assignatura:', error);
      this.toastr.error('Error en eliminar l\'assignatura');
    },
    complete: () => {
      console.log('Assignatura eliminada');
    }
  };


  eliminarAssignatura(assignatura: Assignatura): void {
    this.assignatures = this.assignatures.filter(a => a.id !== assignatura.id);
    this.assignaturesService.deleteAssignaturaById(assignatura.id).subscribe(this.deleteObserver);
  }

  seleccionarAssignatura(assignatura: Assignatura): void {
    this.assignaturesStoreService.setAssignaturaSeleccionada(assignatura);
    console.log(assignatura);
    this.router.navigate([`/dashboard/assignatura`, assignatura.id],
       { state: { assignatura: assignatura }}); // Navega a la ruta de detall d'assignatura
  }

  carregarMateries() {
    this.assignaturesService.getMateries().subscribe({
      next: (res) => {
        this.materies = res;
        console.log('Matèries carregades:', this.materies);
      },
      error: (err) => {
        console.error('Error en carregar les matèries:', err);
      }
    });
  }

}
