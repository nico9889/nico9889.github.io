import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {path: "home", loadComponent: () => import('./components/home/home').then(m => m.Home)},
  {path: "projects", loadComponent: () => import('./components/projects/projects').then(m => m.Projects)},
  {path: "**", redirectTo: 'home'}
]
