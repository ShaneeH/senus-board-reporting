import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // AppShell is the only thing loaded eagerly
    loadComponent: () =>
      import('./layout/app-shell/app-shell').then(m => m.AppShell),

    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Senus | Dashboard'
      },

      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/about').then(m => m.About),
        title: 'Senus | About'
      },

      {
        path: 'documents',
        loadComponent: () =>
          import('./features/documents/documents').then(m => m.Documents),
        title: 'Senus | Documents'
      },

      {
        path: '**',
        loadComponent: () =>
          import('./layout/not-found/not-found').then(m => m.NotFound),
        title: 'Senus | Page Not Found'
      }
    ]
  }
];