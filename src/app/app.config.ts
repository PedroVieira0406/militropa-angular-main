import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { MatPaginatorIntlPtBr } from './services/paginator-ptbr-i8n';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr},
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), provideAnimationsAsync()
  ]
};
