// src/app/services/spacex.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from './auth'; // ← on va récupérer le token via AuthService
import { DashboardData, Launch } from '../models/spacex.model';

@Injectable({
  providedIn: 'root'
})
export class Spacex {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiUrl = environment.apiUrl;

   // Méthode privée pour ajouter le header d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`, {
      headers: this.getAuthHeaders()
    });
  }

  getLaunches(params: { page?: number; per_page?: number; year?: string; success?: boolean } = {}): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/launches`, {
      headers: this.getAuthHeaders(),
      params: params as any
    });
  }

  getLaunchById(id: string): Observable<{ launch: Launch; rocket: any; launchpad: any }> {
    return this.http.get<{ launch: Launch; rocket: any; launchpad: any }>(`${this.apiUrl}/launches/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  resync(): Observable<{ message: string; launches_count: number }> {
    return this.http.post<{ message: string; launches_count: number }>(
      `${this.apiUrl}/sync`,
      {},
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // getDashboard(): Observable<DashboardData> {
  //   return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  // }

  // getLaunches(params: { page?: number; per_page?: number; year?: string; success?: boolean } = {}): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/launches`, { params: params as any });
  // }

  // getLaunchById(id: string): Observable<{ launch: Launch; rocket: any; launchpad: any }> {
  //   return this.http.get<{ launch: Launch; rocket: any; launchpad: any }>(`${this.apiUrl}/launches/${id}`);
  // }

  // resync(): Observable<{ message: string; launches_count: number }> {
  //   return this.http.post<{ message: string; launches_count: number }>(`${this.apiUrl}/sync`, {});
  // }
}