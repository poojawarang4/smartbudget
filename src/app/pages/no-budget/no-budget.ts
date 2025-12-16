import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MonthService } from '../../../month.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-no-budget',
  imports: [FormsModule, CommonModule],
  templateUrl: './no-budget.html',
  styleUrl: './no-budget.scss',
})
export class NoBudget implements OnInit {
  selectedMonth: string = '';
  @Output() startPlanning = new EventEmitter<void>();
  @Output() copyLatestBudget = new EventEmitter<void>();
  hasLatestBudget: boolean = false;

  constructor(private router: Router, private monthService: MonthService) { }

  ngOnInit() {
    this.monthService.selectedMonth$.subscribe(({ month, year }) => {
      this.selectedMonth = this.getMonthName(month);
      this.hasLatestBudget = this.checkIfAnyBudgetExists();
    });
  }

  getMonthName(index: number): string {
    const names = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return names[index];
  }

  goToBudgetPage() {
    this.startPlanning.emit();
    this.router.navigate(['/budget']);
  }

  copyFromLatest() {
    this.copyLatestBudget.emit();
    this.router.navigate(['/budget']);
  }

  checkIfAnyBudgetExists(): boolean {
    for (let year = 2020; year <= 2030; year++) {
      for (let m = 0; m < 12; m++) {
        const key = `budget-${year}-${m}`;
        if (localStorage.getItem(key)) return true;
      }
    }
    return false;
  }
}
