import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/lara';
import { provideHttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    OrganizationChartModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
