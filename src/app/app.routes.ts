import { Routes } from '@angular/router';
import { AuthGuardService } from './auth/services/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layout/main-layout/main-layout.component').then(
        (c) => c.MainLayoutComponent
      ),
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './shared/components/under-development/under-development.component'
          ).then((c) => c.UnderDevelopmentComponent),
      },
      {
        path: 'leads',
        loadComponent: () =>
          import(
            './shared/components/under-development/under-development.component'
          ).then((c) => c.UnderDevelopmentComponent),
      },
      {
        path: 'contragents',
        loadComponent: () =>
          import('./pages/contragents-page/contragents-page.component').then(
            (c) => c.ContragentsPageComponent
          ),
        children: [
          {
            path: 'contragent',
            loadComponent: () =>
              import('./pages/contragent-page/contragent-page.component').then(
                (c) => c.ContragentPageComponent
              ),
          },
          {
            path: 'contragent/:id',
            loadComponent: () =>
              import('./pages/contragent-page/contragent-page.component').then(
                (c) => c.ContragentPageComponent
              ),
          },
        ],
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/tasks-page/tasks-page.component').then(
            (c) => c.TasksPageComponent
          ),
        children: [
          {
            path: 'task',
            loadComponent: () =>
              import('./pages/task-page/task-page.component').then(
                (c) => c.TaskPageComponent
              ),
          },
          {
            path: 'task/:id',
            loadComponent: () =>
              import('./pages/task-page/task-page.component').then(
                (c) => c.TaskPageComponent
              ),
          },
        ],
      },
      {
        path: 'store',
        loadComponent: () =>
          import(
            './shared/components/under-development/under-development.component'
          ).then((c) => c.UnderDevelopmentComponent),
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('./pages/contacts-page/contacts-page.component').then(
            (c) => c.ContactsPageComponent
          ),
        children: [
          {
            path: 'contact',
            loadComponent: () =>
              import('./pages/contact-page/contact-page.component').then(
                (c) => c.ContactPageComponent
              ),
          },
          {
            path: 'contact/:id',
            loadComponent: () =>
              import('./pages/contact-page/contact-page.component').then(
                (c) => c.ContactPageComponent
              ),
          },
        ],
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import(
            './shared/components/under-development/under-development.component'
          ).then((c) => c.UnderDevelopmentComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import(
            './shared/components/under-development/under-development.component'
          ).then((c) => c.UnderDevelopmentComponent),
      },
      {
        path: 'error',
        loadComponent: () =>
          import('./shared/components/error-page/error-page.component').then(
            (c) => c.ErrorPageComponent
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./auth/shared/auth-layout/auth-layout.component').then(
        (c) => c.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/pages/login/login.component').then(
            (c) => c.LoginComponent
          ),
      },
      {
        path: 'logup',
        loadComponent: () =>
          import('./auth/pages/logup/logup.component').then(
            (c) => c.LogupComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/error',
  },
];
