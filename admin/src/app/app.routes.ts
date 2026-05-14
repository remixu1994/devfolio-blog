import { Route } from '@angular/router';
import { AdminShellPageComponent } from './pages/admin-shell.page';
import { DashboardPageComponent } from './pages/dashboard.page';
import { NewPostPageComponent } from './pages/new-post.page';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AdminShellPageComponent,
    children: [
      { path: '', component: DashboardPageComponent },
      { path: 'posts/new', component: NewPostPageComponent },
    ],
  },
];
