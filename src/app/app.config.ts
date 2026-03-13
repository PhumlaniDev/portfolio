import { ApplicationConfig, SecurityContext } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { environment } from '../environments/environment';
import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';

const firebaseConfig = environment.firebase;

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    provideMarkdown({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
    }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
