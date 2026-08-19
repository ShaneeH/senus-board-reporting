import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',

    // Loads the main application shell when the app starts.
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
        path: 'add-document',
        loadComponent: () =>
          import('./features/add-document/add-document').then(m => m.AddDocument),
        title: 'Senus | Add Report'
      }
    ]
  },

  // Any unknown route goes back to the dashboard.
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];