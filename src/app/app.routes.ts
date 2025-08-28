import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailComponent } from './pages/blog/blog-detail/blog-detail.component';
import { BlogEditorComponent } from './pages/blog/editor/blog-editor/blog-editor.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { Routes } from '@angular/router';
import { adminGuard } from './auth/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: AboutComponent },
  { path: 'admin', component: BlogEditorComponent, canActivate: [adminGuard] },
  { path: 'contact', component: ContactsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
  { path: 'projects', component: ProjectsComponent },
  {
    path: 'login',
    component: LoginComponent,
  },
];
