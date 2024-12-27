import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AlumneListComponent } from '../alumne-list/alumne-list.component';
import { ActivitatListComponent } from '../activitat-list/activitat-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Activitat, Assignatura } from '../models/models';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignaturesService } from '../services/assignatures.service';
import { AssignaturesStoreService } from '../services/assignaturesStore.service';
import { InformeNotesComponent } from '../informe-notes/informe-notes.component';

@Component({
  selector: 'app-assignatura',
  standalone: true,
  imports: [MatTabsModule, CommonModule, AlumneListComponent, ActivitatListComponent, InformeNotesComponent],
  templateUrl: './assignatura.component.html',
  styleUrl: './assignatura.component.css'
})
export class AssignaturaComponent implements OnInit {

  assignaturaId!: string;
  assignatura!: Assignatura;
  selectedTab = 0;

  constructor(private assignaturesService: AssignaturesService, private router: Router,  private assignaturesStoreService: AssignaturesStoreService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

    this.assignatura = this.assignaturesStoreService.getAssignaturaSeleccionada()!;


    if (!this.assignatura) {
      console.warn('Assignatura no trobada! Redirigint al dashboard.');
      this.router.navigate(['/dashboard']);
    } else {
      console.log('Assignatura carregada:', this.assignatura);
    }
  }

  onTabChange(index: number): void {
    // this.assignatura = { ...this.assignatura }; // Força la propagació dels canvis
    // this.cdr.detectChanges();
    this.selectedTab = index;
  }


}
