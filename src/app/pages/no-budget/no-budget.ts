import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MonthService } from '../../../month.service';

@Component({
  selector: 'app-no-budget',
  imports: [],
  templateUrl: './no-budget.html',
  styleUrl: './no-budget.scss',
})
export class NoBudget {
selectedMonth: string = '';
   constructor(private router: Router,private monthService: MonthService) {}

   ngOnInit() {
  this.monthService.selectedMonth$.subscribe(month => {
    this.selectedMonth = month;
  });
}

   
  goToBudgetPage() {
    this.router.navigate(['/budget']);
  }
}
