import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { Auth } from '../services/auth';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(Auth);

  // Vérifie si la requête est destinée à ton API Laravel
  if (req.url.startsWith(environment.apiUrl)) {
    const token = auth.getToken();
    if (token) {
      // Clone la requête avec le header d'authentification
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next(authReq);
    }
  }

  // Sinon, laisse passer la requête telle quelle (ex: appels à des APIs publiques)
  return next(req);
};