// src/app/components/login/login.ts
import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ← Importe FormsModule ici
import { CommonModule } from '@angular/common'; // ← Ajoute cette ligne

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{
  private auth = inject(Auth);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  email = 'user@example.com';
  password = 'password';
  error = '';

  onSubmit(): void {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Identifiants invalides. Veuillez réessayer.';
        console.error('❌ Échec de la connexion');
      }
    });
  }
}