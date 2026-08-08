import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(), // Para habilitar a detecção de mudanças no Angular
    provideRouter(routes), // Para configurar as rotas 
    provideHttpClient() // Para fazer requesições HTTP
  ]
};
