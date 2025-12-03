import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-budget',
  imports: [],
  templateUrl: './no-budget.html',
  styleUrl: './no-budget.scss',
})
export class NoBudget {

   constructor(private router: Router) {}
   
  goToBudgetPage() {
    this.router.navigate(['/budget']);
  }
}
