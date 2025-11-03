import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('spacex-dashboard');
  private auth = inject(Auth);
  constructor(private router: Router) {}

  // Récupère l'utilisateur connecté (pour affichage)
  user() {
    return this.auth.getUser();
  }

  // Fonction pour naviguer vers la page de login
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Méthode appelée au clic sur "Déconnexion"
  logout(): void {
    this.auth.logout(); // → redirige vers /login
  }
}
