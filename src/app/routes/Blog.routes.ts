import { Routes } from '@angular/router';
import { adminGuard } from '../auth/admin.guard'; // your existing Firebase Auth guard

export const BLOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/blog/blog.component').then((m) => m.BlogComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('../pages/blog/blog-editor/blog-editor.component').then((m) => m.BlogEditorComponent),
  },
  {
    path: 'admin/new',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('../pages/blog/blog-editor/blog-editor.component').then((m) => m.BlogEditorComponent),
  },
  {
    path: 'admin/edit/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('../pages/blog/blog-editor/blog-editor.component').then((m) => m.BlogEditorComponent),
  },
  {
    // Must be last — catches /blog/:slug
    path: ':slug',
    loadComponent: () =>
      import('../pages/blog/blog-detail/blog-detail.component').then((m) => m.BlogDetailComponent),
  },
];

// In your app.routes.ts, add:
// { path: 'blog', loadChildren: () => import('./features/blog/blog.routes').then(m => m.BLOG_ROUTES) }
