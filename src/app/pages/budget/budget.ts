import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-budget',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './budget.html',
  styleUrls: ['./budget.scss'],
})
export class Budget implements OnInit{
  isOpen = false;
  isOpeni = false;
  isExp = false;
  isExpand = false
  totalIncome: number = 0;
  totalPlannedExpenses: number = 0;
  budgetStatus: string = "";
  amountLeft: number = 0;
  showIncomeWarning = false;
  showLeftToast: boolean = false;
  leftMessage: string = "";
  editValue: any = '';
  incomeTotal: number = 0;
  allCategories: any[][] = [];
  hasEdited = false;
  hasEnteredAmount = false;


  income = [
    { name: 'Salary 1', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Salary 2', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Rental Income', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Investment Income', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Other Income', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
  ];


  housing = [
    { name: 'Mortgage', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Rent', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Water', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
  ];

  tranportation = [
    { name: 'Fuel', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Insurance', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Maintenance', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
  ];
  food = [
    { name: 'Groceries', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Restaurants', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
  ];
  insurance = [
    { name: 'Health', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Life', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
  ];
  savings = [
    { name: 'Savings', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
  ];

  giving = [
    { name: 'Giving', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
  ];

  personal = [
    { name: 'Personal', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
  ];

  health = [
    { name: 'Health', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
  ];

  loan = [
    { name: 'Loan Repayment', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
  ];

  entertainment = [
    { name: 'Entertainment', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
  ];

  childcare = [
    { name: 'Child Care', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
  ];
  public pieChartOptions: ChartOptions = { responsive: true };
  public pieChartLabels: string[] = [
    'Savings', 'Giving', 'Housing', 'Transportation', 'Food', 
    'Personal', 'Health', 'Insurance', 'Loan Repayment', 'Entertainment', 'Child Care'
  ];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartColors = [{ backgroundColor: ['#4caf50', '#9c27b0', '#ff9800', '#ffeb3b', '#ff9800', '#e91e63', '#f44336', '#8e24aa', '#3f51b5', '#2196f3', '#8bc34a'] }];


  ngOnInit() {
    this.allCategories = [
      this.savings || [],
      this.giving || [],
      this.housing || [],
      this.tranportation || [],
      this.food || [],
      this.personal || [],
      this.health || [],
      this.insurance || [],
      this.loan || [],
      this.entertainment || [],
      this.childcare || []
    ];
 this.updateChart();
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  togglet() {
    this.isExp = !this.isExp;
  }
  togglei() {
    this.isOpeni = !this.isOpeni;
  }
  togglef() {
    this.isExpand = !this.isExpand;
  }

  calculateTotals() {

    // 1. Total income
    this.totalIncome = this.income.reduce((sum, i) => sum + Number(i.planned), 0);

    // 2. Total category planned expenses
    const allCategories = [
      ...this.housing,
      ...this.tranportation,
      ...this.food,
      ...this.insurance,
      ...this.savings,
      ...this.giving,
      ...this.personal,
      ...this.health,
      ...this.loan,
      ...this.entertainment,
      ...this.insurance,
      ...this.childcare
    ];

    this.totalPlannedExpenses = allCategories.reduce(
      (sum, i) => sum + Number(i.planned), 0
    );

    // 3. Balance
    this.amountLeft = this.totalIncome - this.totalPlannedExpenses;
this.updateChart();
    // 4. Budget Status
    if (this.amountLeft > 0) {
      this.budgetStatus = "Amount left to budget";
    } else if (this.amountLeft === 0) {
      this.budgetStatus = "You've Got a Budget!";
    } else {
      this.budgetStatus = "Amount over budget";
    }
  }

  editAmount(item: any, field: 'planned' | 'received', isIncome: boolean) {

    // Recalculate income
    this.incomeTotal = this.income.reduce(
      (sum, inc) => sum + Number(inc.planned || 0),
      0
    );

    // Block category editing before income
    if (!isIncome && this.incomeTotal <= 0) {
      this.leftMessage = "Please Enter Income First";
      this.showLeftToast = true;
      setTimeout(() => (this.showLeftToast = false), 2000);
      return;
    }

    // Turn ON edit mode
    const editKey = 'edit' + this.capitalize(field);
    item[editKey] = true;

    // Clear input if value is 0 or "0.00"
    if (Number(item[field]) === 0) {
      item[field] = '';
    }
  }

  // ✅ Correct helper method inside class
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Save value and close input
  finishEdit(item: any, field: 'planned' | 'received') {
    item[field] = Number(item[field] || 0).toFixed(2);
    item[`edit${field.charAt(0).toUpperCase() + field.slice(1)}`] = false;
    this.calculateTotals();
  }

  shouldShowSummaryBox(): boolean {
    if (!this.hasEnteredAmount) return false;

    const hasIncomeAmount =
      this.income?.some((inc: any) =>
        Number(inc.planned) > 0 || Number(inc.received) > 0
      ) || false;

    const hasCategoryAmount =
      this.allCategories.some((category: any[]) =>
        category.some((i: any) =>
          Number(i.planned) > 0 || Number(i.received) > 0
        )
      );

    return hasIncomeAmount || hasCategoryAmount;
  }
  onAmountChange() {
    this.hasEnteredAmount = true;
    this.calculateTotals(); // if you have a method that updates amountLeft
  }
updateChart() {
    // If nothing entered, show single color
    const hasData = this.allCategories.flat().some(i => Number(i.planned) > 0);
    if (!hasData) {
      this.pieChartData = [100]; // 1 slice
      this.pieChartLabels = ['No Data'];
      this.pieChartColors = [{ backgroundColor: ['#c0c0c0'] }];
      return;
    }

    // Prepare percentage-wise data
    const data: number[] = [];
    const labels: string[] = [];
    const colors: string[] = [
      '#4caf50', '#9c27b0', '#ff9800', '#ffeb3b', '#ff9800', '#e91e63',
      '#f44336', '#8e24aa', '#3f51b5', '#2196f3', '#8bc34a'
    ];

    this.allCategories.forEach((catArr, index) => {
      const total = catArr.reduce((sum, i) => sum + Number(i.planned), 0);
      if (total > 0) {
        data.push(total);
        labels.push(this.pieChartLabels[index]);
      }
    });

    this.pieChartData = data;
    this.pieChartLabels = labels;
    this.pieChartColors = [{ backgroundColor: colors.slice(0, data.length) }];
  }
}
