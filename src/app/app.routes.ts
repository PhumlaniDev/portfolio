import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: AboutComponent },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'blog',
    loadChildren: () => import('./routes/Blog.routes').then((m) => m.BLOG_ROUTES),
  },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactsComponent },
];
