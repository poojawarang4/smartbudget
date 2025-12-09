import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { NoBudget } from '../no-budget/no-budget';
import { MonthService } from '../../../month.service';
import { ResetBudgetPopupComponent } from '../reset-budget-popup/reset-budget-popup';
import { NgChartsModule } from 'ng2-charts';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-budget',
  imports: [CommonModule, FormsModule, ResetBudgetPopupComponent, NgChartsModule, MatDialogModule],
  standalone: true,
  templateUrl: './budget.html',
  styleUrls: ['./budget.scss'],
})
export class Budget implements OnInit {
  isOpen = false;
  public categoryDisplay: any[] = [];
  chartColors = [
    '#1E90FF', '#FF4C4C', '#FFA500', '#32CD32', '#8A2BE2',
    '#20B2AA', '#FF1493', '#A52A2A', '#708090', '#FFD700',
    '#00CED1', '#FF7F50'
  ];
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
  selectedYear = new Date().getFullYear();
  selectedMonthIndex = new Date().getMonth(); // 0-11
  budgetExistsForMonth = true;
  selectedMonth = '';
  expenses: any[] = [];
  showResetPopup = false;
  hasLatestBudget: boolean = false;
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
  public pieChartOptions: any = {
    plugins: {
      legend: { display: false }  // ❌ hide default legend
    }
  };
  public pieChartLabels: string[] = [];
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public pieChartType: ChartType = 'pie';
  public pieChartColors = [{ backgroundColor: ['#4caf50', '#9c27b0', '#ff9800', '#ffeb3b', '#ff9800', '#e91e63', '#f44336', '#8e24aa', '#3f51b5', '#2196f3', '#8bc34a'] }];
  constructor(private monthService: MonthService, private dialog: MatDialog) { }

  ngOnInit() {
    this.monthService.selectedMonth$.subscribe(data => {
      this.selectedMonth = this.getMonthName(data.monthIndex);
    });
    this.hasLatestBudget = this.checkIfAnyBudgetExists();
    this.monthService.selectedMonth$.subscribe(data => {
      this.selectedMonthIndex = data.monthIndex;
      this.selectedYear = data.year;
      this.loadBudgetForMonth();
    });
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
    this.calculateSummaryPieChart();
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

  startPlanningForNewMonth() {
    this.resetToZeroValues();
    this.budgetExistsForMonth = true;
    this.saveBudget();
  }
  startPlanningForMonth() {
    this.loadBudgetForMonth(true);
  }

  getMonthIndexFromName(index: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[index];
  }

  onMonthChanged(event: any) {
    this.selectedMonthIndex = event.monthIndex;
    this.selectedYear = event.year;

    this.loadBudgetForMonth();
  }
  getMonthName(index: number) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[index];
  }

  getStorageKey() {
    return `budget-${this.selectedYear}-${this.selectedMonthIndex}`;
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
    this.calculateSummaryPieChart();
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

  finishEdit(item: any, type: string) {
    item["edit" + this.capitalize(type)] = false;
    this.onAmountChange();
    this.calculateSummaryPieChart();
    this.saveBudget();  // ← Save month-wise
  }

  shouldShowSummaryBox(): boolean {
    const hasIncomeAmount =
      this.income.some(i => Number(i.planned) > 0 || Number(i.received) > 0);

    const hasCategoryAmount =
      this.allCategories.some(cat =>
        cat.some(i => Number(i.planned) > 0 || Number(i.received) > 0)
      );

    // Only show if at least one amount > 0
    return hasIncomeAmount || hasCategoryAmount;
  }
  onAmountChange() {
    const hasAmount =
      this.income.some(i => Number(i.planned) > 0 || Number(i.received) > 0) ||
      this.allCategories.some(cat =>
        cat.some(i => Number(i.planned) > 0 || Number(i.received) > 0)
      );

    this.hasEnteredAmount = hasAmount;
    this.calculateTotals();
  }

  getMonthKey(): string {
    const month = (this.selectedMonthIndex + 1).toString().padStart(2, '0');
    return `${this.selectedYear}-${month}`;
  }

  loadBudgetForMonth(forceCreate: boolean = false) {
    const key = this.getMonthKey()
    const savedData = localStorage.getItem(key);
    if (savedData) {
      const budget = JSON.parse(savedData);
      this.income = budget.income;
      this.housing = budget.housing;
      this.food = budget.food;
      this.tranportation = budget.tranportation;
      this.insurance = budget.insurance;
      this.savings = budget.savings;
      this.giving = budget.giving;
      this.personal = budget.personal;
      this.health = budget.health;
      this.loan = budget.loan;
      this.entertainment = budget.entertainment;
      this.childcare = budget.childcare;
      this.budgetExistsForMonth = true;
    } else {
      this.resetToZeroValues();
      this.budgetExistsForMonth = forceCreate ? true : false;
    }
    this.onAmountChange();
  }

  resetToZeroValues() {
    const resetArray = (arr: any[]) =>
      arr.map(item => ({
        ...item,
        planned: '0.00',
        received: '0.00',
        editPlanned: false,
        editReceived: false
      }));
    this.income = resetArray(this.income);
    this.savings = resetArray(this.savings);
    this.giving = resetArray(this.giving);
    this.housing = resetArray(this.housing);
    this.tranportation = resetArray(this.tranportation);
    this.food = resetArray(this.food);
    this.personal = resetArray(this.personal);
    this.health = resetArray(this.health);
    this.insurance = resetArray(this.insurance);
    this.loan = resetArray(this.loan);
    this.entertainment = resetArray(this.entertainment);
    this.childcare = resetArray(this.childcare);
    this.hasEnteredAmount = false; 
    this.amountLeft = 0; 
  }

  onStartPlanning() {
    this.resetBudgetValues();
    this.budgetExistsForMonth = true; // show budget page
    this.saveBudget(); // save blank version
  }

  resetBudgetValues() {
    this.income = [
      { name: 'Salary 1', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
    ];
    this.housing = this.housing.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.tranportation = this.tranportation.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.food = this.food.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.insurance = this.insurance.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.savings = this.savings.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.giving = this.giving.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.personal = this.personal.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.health = this.health.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.loan = this.loan.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.entertainment = this.entertainment.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.childcare = this.childcare.map(i => ({ ...i, planned: '0.00', received: '0.00' }));
    this.amountLeft = 0;
  }

  saveBudget() {
    const key = this.getMonthKey();
    const data = {
      income: this.income,
      savings: this.savings,
      giving: this.giving,
      housing: this.housing,
      tranportation: this.tranportation,
      food: this.food,
      personal: this.personal,
      health: this.health,
      insurance: this.insurance,
      loan: this.loan,
      entertainment: this.entertainment,
      childcare: this.childcare
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  startNewBudget() {
    this.budgetExistsForMonth = true;
  }

  copyLatestBudgetForMonth() {
    let year = this.selectedYear;
    let month = this.selectedMonthIndex - 1;

    while (year >= 2020) {
      if (month < 0) {
        month = 11;
        year--;
        if (year < 2020) break;
      }
      const key = `${year}-${(month + 1).toString().padStart(2, '0')}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        localStorage.setItem(this.getMonthKey(), saved);
        this.loadBudgetForMonth();
        return;
      }
      month--;
    }
  }


  findLatestBudget(): any {
    for (let year = 2030; year >= 2020; year--) {
      for (let m = 11; m >= 0; m--) {
        const key = `${year}-${(m + 1).toString().padStart(2, '0')}`;
        const saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
      }
    }
    return null;
  }

  openResetPopup() {
    const dialogRef = this.dialog.open(ResetBudgetPopupComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Popup closed:', result);
      if (result === 'zero') {
        this.resetAllAmountsToZero();
      } else if (result === 'copy') {
        this.copyLastMonthBudget();
      }
    });
  }

  resetAllAmountsToZero() {
    this.showResetPopup = false;
    const allGroups = [
      this.income, this.savings, this.giving, this.housing, this.tranportation,
      this.food, this.personal, this.health, this.insurance, this.loan,
      this.entertainment, this.childcare
    ];
    allGroups.forEach(group => {
      group.forEach(item => {
        item.planned = '0.00';
      });
    });
     this.hasEnteredAmount = false;
     this.amountLeft = 0; 
    this.calculateTotals();
    this.saveBudget();
    alert("All planned amounts have been reset to ₹0.");
  }

  copyLastMonthBudget() {
    const lastMonthIndex = this.selectedMonthIndex === 0 ? 11 : this.selectedMonthIndex - 1;
    const lastMonthYear = this.selectedMonthIndex === 0 ? this.selectedYear - 1 : this.selectedYear;
    const lastKey = `${lastMonthYear}-${(lastMonthIndex + 1).toString().padStart(2, '0')}`;
    const lastData = localStorage.getItem(lastKey);
    if (!lastData) {
      console.warn("No previous budget found.");
      return;
    }
    localStorage.setItem(this.getMonthKey(), lastData);
    this.loadBudgetForMonth();
  }

  calculateSummaryPieChart() {
    const totalIncome = this.income.reduce((acc, item) => acc + Number(item.planned || 0), 0);
    if (totalIncome === 0) {
      this.pieChartLabels = ['No Data'];
      this.pieChartData = {
        labels: ['No Data'],
        datasets: [{ data: [1], backgroundColor: ['#e0e0e0'] }]
      };
      this.categoryDisplay = [];
      return;
    }

    const categories = [
      { name: 'Savings', data: this.savings },
      { name: 'Giving', data: this.giving },
      { name: 'Housing', data: this.housing },
      { name: 'Transportation', data: this.tranportation },
      { name: 'Food', data: this.food },
      { name: 'Personal', data: this.personal },
      { name: 'Health', data: this.health },
      { name: 'Insurance', data: this.insurance },
      { name: 'Loan', data: this.loan },
      { name: 'Entertainment', data: this.entertainment },
      { name: 'Child Care', data: this.childcare }
    ];
    const labels: string[] = [];
    const values: number[] = [];
    categories.forEach(cat => {
      const sum = cat.data.reduce((acc, item) => acc + Number(item.planned || 0), 0);
      if (sum > 0) {
        labels.push(cat.name);
        values.push(sum);
      }
    });

    const percentages = values.map(v => +((v / totalIncome) * 100).toFixed(1));
    const totalPercent = percentages.reduce((a, b) => a + b, 0);
    const remainingPercent = +(100 - totalPercent).toFixed(1);

    // INTERNAL CHART DATA
    const chartData = [...percentages, remainingPercent];

    const chartColors = [
      ...this.chartColors.slice(0, percentages.length),
      "#e0e0e0" // remaining hidden color
    ];

    // Labels include remaining but we hide it in UI
    this.pieChartLabels = [...labels, "Remaining"];

    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        {
          data: chartData,
          backgroundColor: chartColors,
          borderWidth: 4
        }
      ]
    };

    // ONLY show real categories
    this.categoryDisplay = labels.map((name, index) => ({
      name,
      percent: percentages[index],
      color: this.chartColors[index]
    }));

    // HIDE "Remaining" in tooltip & legend
    this.pieChartOptions = {
      cutoutPercentage: 70,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              if (context.label === "Remaining") return ""; // hide
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    };
  }
}
