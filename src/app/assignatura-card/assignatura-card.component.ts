import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Assignatura } from '../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assignatura-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignatura-card.component.html',
  styleUrls: ['./assignatura-card.component.css']
})
export class AssignaturaCardComponent {
  @Input() assignatura!: Assignatura;
  @Input() menuObert: boolean = false;  // Controla si el menú està obert
  @Output() onEliminarAssignatura = new EventEmitter<Assignatura>();
  @Output() onEditarAssignatura = new EventEmitter<Assignatura>();
  @Output() onToggleMenu = new EventEmitter<void>();  // Emet quan es fa clic per obrir/tancar el menú


  toggleMenu(): void {
    // this.menuObert = !this.menuObert;
    this.onToggleMenu.emit();
  }

  eliminarAssignatura(): void {
    this.onEliminarAssignatura.emit(this.assignatura);
  }

  editarAssignatura(): void {
    this.onEditarAssignatura.emit(this.assignatura);
  }

   // Escolta els clics fora del component per tancar el menú
   @HostListener('document:click', ['$event'])
   onClickOutside(event: Event): void {
     const target = event.target as HTMLElement;

     // Tanca el menú si es fa clic fora del menú i del botó
     if (!target.closest('.menu-button') && !target.closest('.menu-container')) {
       this.menuObert = false;
     }
   }

    // Funció per generar un color hex basat en el nom de l'assignatura
  generarColorAvatar(nom: string): string {
    let hash = 0;
    for (let i = 0; i < nom.length; i++) {
      hash = nom.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
  }
}
