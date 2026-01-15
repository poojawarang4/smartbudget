import { Routes } from '@angular/router';
import { NoBudget } from './pages/no-budget/no-budget';
import { Budget } from './pages/budget/budget';
import { Overview } from './overview/overview';
import { BudgetTrendComponent } from './budget-trend-component/budget-trend-component';
import { Signup } from './signup/signup';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'no-budget', component: NoBudget },
  { path: 'budget', component: Budget },
  { path: 'overview', component: Overview },
  { path: 'trend', component: BudgetTrendComponent },
];
