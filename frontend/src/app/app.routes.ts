import { Routes } from '@angular/router';
import { AppShell } from './layout/app-shell/app-shell';
import { Dashboard } from './features/dashboard/dashboard';
import { About } from './features/about/about';
import { AddDocument } from './features/add-document/add-document';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'about',
        component: About
      },
      {
       path: 'add-document',
       component: AddDocument
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];