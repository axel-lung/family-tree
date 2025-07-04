import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/lara';
import { provideHttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,       // ✅ importer ici
      OrganizationChartModule,
      ButtonModule,
      InputTextModule,
      CardModule,
      NgxChartsModule,
      ToastModule,
      TableModule,
      InputSwitchModule
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
