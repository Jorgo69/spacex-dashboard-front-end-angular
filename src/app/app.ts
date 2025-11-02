import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('spacex-dashboard');
  private auth = inject(Auth);

  // Récupère l'utilisateur connecté (pour affichage)
  user() {
    return this.auth.getUser();
  }

  // Méthode appelée au clic sur "Déconnexion"
  logout(): void {
    this.auth.logout(); // → redirige vers /login
  }
}
