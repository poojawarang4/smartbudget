import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MonthService } from '../../month.service';

export interface CategoryTrend {
  category: string;
  current: number;
  average: number;
  percentage: number; // current vs average
  status: 'good' | 'warning' | 'bad';
}

@Component({
  selector: 'app-budget-trend-component',
  imports: [CommonModule],
  templateUrl: './budget-trend-component.html',
  styleUrl: './budget-trend-component.scss',
})

export class BudgetTrendComponent implements OnInit, OnChanges {
  @Input() selectedYear!: number;
  @Input() selectedMonthIndex!: number; // 0–11
  categoryTrends: CategoryTrend[] = [];
  categories = [
    { key: 'savings', label: 'Savings' },
    { key: 'giving', label: 'Giving' },
    { key: 'housing', label: 'Housing' },
    { key: 'tranportation', label: 'Transport' },
    { key: 'food', label: 'Food' },
    { key: 'personal', label: 'Personal' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'loan', label: 'Loan Repayment' },
    { key: 'entertainment', label: 'Entertainment' },
    { key: 'childcare', label: 'Child Care' },
  ];
  currentMonthPlanned = 0;
  last3MonthsAverage = 0;
  difference = 0;
  percentChange = 0;

  ngOnInit() {
    this.monthService.selectedMonth$.subscribe(({ month, year }) => {
      this.selectedMonthIndex = month;
      this.selectedYear = year;
      this.calculateCategoryComparison();
    });
  }

  getMonthKey() {
    return this.getKey(this.selectedYear, this.selectedMonthIndex);
  }

  constructor(private monthService: MonthService) {}

  ngOnChanges() {
    if (
      this.selectedYear !== undefined &&
      this.selectedMonthIndex !== undefined
    ) {
      this.calculateCategoryComparison();
    }
  }

  calculateCategoryComparison() {
    const currentBudget = this.getBudget(
      this.getKey(this.selectedYear, this.selectedMonthIndex)
    );
    this.categoryTrends = this.categories.map(cat => {
      const current = this.getCategoryTotal(currentBudget, cat.key);
      const last3 = this.getLast3MonthsCategoryAverage(cat.key);
      console.log("last3",last3);
      
      const percentage =
  last3 === 0
    ? current > 0 ? 180 : 0   // show max if spending exists
    : Math.min((current / last3) * 100, 180);

           const status =
      percentage <= 100
        ? 'good'
        : percentage <= 110
          ? 'warning'
          : 'bad';

    console.log(cat.label, { current, last3, percentage, status });
      return {
        category: cat.label,
        current,
        average: last3,
        percentage,
        status
      };
      
    });
  }

  getLast3MonthsCategoryAverage(categoryKey: string): number {
    const totals: number[] = [];
    for (let i = 1; i <= 3; i++) {
      const { year, month } =
        this.getPreviousMonth(this.selectedYear, this.selectedMonthIndex, i);
      const budget = this.getBudget(this.getKey(year, month));
      if (budget) {
        const total = this.getCategoryTotal(budget, categoryKey);
        totals.push(total);
      }
    }
    if (totals.length === 0) return 0;
    return totals.reduce((a, b) => a + b, 0) / totals.length;
  }

  getCategoryTotal(budget: any, key: string): number {
    if (!budget || !budget[key]) return 0;
    return budget[key].reduce(
      (sum: number, i: any) => sum + Number(i.planned || 0),
      0
    );
  }
  /* ---------- helpers ---------- */
  getKey(year: number, monthIndex: number) {
    return `budget-${year}-${(monthIndex + 1).toString().padStart(2, '0')}`;
  }

  getBudget(key: string) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  getPreviousMonth(year: number, month: number, backBy: number) {
    const date = new Date(year, month - backBy);
    return {
      year: date.getFullYear(),
      month: date.getMonth()
    };
  }
getNeedleAngle(percent: number): number {
  // clamp between 0–180
  const clamped = Math.min(Math.max(percent, 0), 180);
  return (clamped / 180) * 180 - 90;
}

}
