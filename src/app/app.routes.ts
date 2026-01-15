import { Routes } from '@angular/router';
import { NoBudget } from './pages/no-budget/no-budget';
import { Budget } from './pages/budget/budget';
import { Overview } from './overview/overview';
import { Login } from './login/login';
import { Signup } from './signup/signup';

export const routes: Routes = [
  { path: '', redirectTo: 'budget', pathMatch: 'full' },
  { path: 'no-budget', component: NoBudget },
  { path: 'budget', component: Budget },
  { path: 'overview', component: Overview },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup }
];
