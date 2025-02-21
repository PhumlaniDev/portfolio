import { AboutComponent } from './pages/about/about.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'contact', component: ContactsComponent },
  { path: 'projects', component: ProjectsComponent },
];
