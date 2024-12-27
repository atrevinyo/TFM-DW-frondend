import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menusuperior',
  standalone: true,
  imports: [FormsModule, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './menusuperior.component.html',
  styleUrl: './menusuperior.component.css'
})
export class MenusuperiorComponent {

  isLoggedIn = false;


  @Input() mostrarBotoAfegirAssignatura: any = null; // Propietat d per saber si hi ha una assignatura seleccionada
  @Output() onAfegirAssignatura = new EventEmitter<void>();
  @Input() assignaturaSeleccionada?: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  afegirAssignatura(): void {
    this.onAfegirAssignatura.emit(); // Emiteix l'esdeveniment per crear una nova assignatura
  }

  logout() {
    this.authService.logout()
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

}
