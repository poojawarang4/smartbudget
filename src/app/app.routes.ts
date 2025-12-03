import { Routes } from '@angular/router';
import { NoBudget } from './pages/no-budget/no-budget';
import { Budget } from './pages/budget/budget';

export const routes: Routes = [
  { path: '', redirectTo: 'no-budget', pathMatch: 'full' },
  { path: 'no-budget', component: NoBudget },
  { path: 'budget', component: Budget }
];
