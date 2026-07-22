import { Routes } from '@angular/router';

import { AppShell } from './layout/app-shell/app-shell';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [

  {
    path: '',
    component: AppShell,

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: Dashboard
      }

    ]

  }

];