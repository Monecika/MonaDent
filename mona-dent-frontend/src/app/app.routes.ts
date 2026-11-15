import { Routes } from '@angular/router';

import { Layout } from './layout/layout/layout';
import { authGuard } from './core/authGuard';
import { roleGuard } from './core/roleGuard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((module) => module.LoginComponent),
  },

  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard').then((module) => module.Dashboard),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./pages/appointments/appointments').then((module) => module.Appointments),
      },
      {
        path: 'patients',
        loadComponent: () => import('./pages/patients/patients').then((module) => module.Patients),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account-settings/account-settings').then(
            (module) => module.AccountSettings,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/user-management/user-management').then((module) => module.UserManagement),
        canActivate: [roleGuard('ADMIN', 'MANAGER')],
      },
      {
        path: 'branches',
        loadComponent: () =>
          import('./pages/branch-management/branch-management').then(
            (module) => module.BranchManagement,
          ),
        canActivate: [roleGuard('ADMIN')],
      },
      {
        path: 'ip-addresses',
        loadComponent: () =>
          import('./pages/ip-address-management/ip-address-management').then(
            (module) => module.IpAddressManagement,
          ),
        canActivate: [roleGuard('ADMIN')],
      },
      {
        path: 'patients/:id',
        loadComponent: () =>
          import('./pages/patient-details/patient-details').then(
            (module) => module.PatientDetails,
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
