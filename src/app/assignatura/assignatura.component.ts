import { Component, Input, OnInit } from '@angular/core';
import { AlumneListComponent } from '../alumne-list/alumne-list.component';
import { ActivitatListComponent } from '../activitat-list/activitat-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Assignatura } from '../models/models';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignaturesService } from '../services/assignatures.service';
import { AssignaturesStoreService } from '../services/assignaturesStore.service';

@Component({
  selector: 'app-assignatura',
  standalone: true,
  imports: [MatTabsModule, CommonModule, AlumneListComponent, ActivitatListComponent],
  templateUrl: './assignatura.component.html',
  styleUrl: './assignatura.component.css'
})
export class AssignaturaComponent implements OnInit {

  assignaturaId!: string;
  assignatura!: Assignatura |null

  constructor(private assignaturesService: AssignaturesService, private router: Router,  private assignaturesStoreService: AssignaturesStoreService) {}

  ngOnInit(): void {

    this.assignatura = this.assignaturesStoreService.getAssignaturaSeleccionada()!;

    if (!this.assignatura) {
      console.warn('Assignatura no trobada! Redirigint al dashboard.');
      this.router.navigate(['/dashboard']);
    } else {
      console.log('Assignatura carregada:', this.assignatura);
    }
  }

}
