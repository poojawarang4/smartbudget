import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { MonthService } from '../../../month.service';
import { ResetBudgetPopupComponent } from '../reset-budget-popup/reset-budget-popup';
import { NgChartsModule } from 'ng2-charts';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import localeIn from '@angular/common/locales/en-IN';
import { registerLocaleData } from '@angular/common';
import { BudgetSharedService } from '../../layout/budget-shared.service';

registerLocaleData(localeIn);

interface Transaction {
  id: string;
  icon: string,
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  month: number; // 0–11
  year: number;
}
interface SummaryItem {
  allotted: number;
  spent: number;
  remain: number;
}
@Component({
  selector: 'app-budget',
  imports: [CommonModule, FormsModule, ResetBudgetPopupComponent, NgChartsModule, MatDialogModule],
  standalone: true,
  templateUrl: './budget.html',
  styleUrls: ['./budget.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-IN' }
  ]

})
export class Budget implements OnInit {
  showPopup = false;
  popupType: 'income' | 'expense' = 'expense';

  incomeCategories: string[] = [
    "Salary 1",
    "Salary 2",
    "Rental Income",
    "Investment Income",
    "Other Income"
  ];

  transactions: Transaction[] = [];

  summary: Record<string, SummaryItem> = {};

  expenseCategories: any[] = [
    { name: "Savings" },
    { name: "Giving" },
    {
      name: "Housing",
      sub: [
        "Mortgage",
        "Rent",
        "Water",
        "Society Maintenance",
        "Gas",
        "Electricity",
        "Trash",
        "Cable",
        "Wi-Fi",
        "Phone"
      ]
    },
    {
      name: "Transportation",
      sub: ["Fuel", "Insurance", "Maintenance"]
    },
    {
      name: "Food",
      sub: ["Groceries", "Restaurants"]
    },
    { name: "Personal" },
    { name: "Health" },
    {
      name: "Insurance",
      sub: ["Health", "Life"]
    },
    { name: "Loan Repayment" },
    { name: "Entertainment" },
    { name: "Child Care" }
  ];

  selectedCategoryList: string[] = [];

  form = {
    category: '',
    amount: 0,
    date: '',
    description: ''
  };
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
  successPopup = false;
  successMessage = "";

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
  activeTab: 'summary' | 'transactions' = 'summary';

  public pieChartType: ChartType = 'pie';
  public pieChartColors = [{ backgroundColor: ['#4caf50', '#9c27b0', '#ff9800', '#ffeb3b', '#ff9800', '#e91e63', '#f44336', '#8e24aa', '#3f51b5', '#2196f3', '#8bc34a'] }];
  constructor(private monthService: MonthService, private dialog: MatDialog, private budgetShared: BudgetSharedService) { }

  ngOnInit() {
    // this.logPreviousMonthBudget();
    this.monthService.selectedMonth$.subscribe(({ month, year }) => {
      this.selectedMonthIndex = month;
      this.selectedYear = year;
      this.selectedMonth = this.getMonthName(month);
      this.loadBudgetForMonth();
      this.loadTransactions();
      this.loadSummary();
      this.checkPreviousMonthBudget();
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
    this.loadTransactions();
    this.loadSummary();
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
  getCurrentYearMonth() {
    const key = this.getMonthKey(); // e.g., budget-2025-10
    const parts = key.split('-');   // ["budget", "2025", "10"]

    return {
      year: Number(parts[1]),
      month: Number(parts[2])
    };
  }

  getPreviousMonthKey(): string | null {
    const { year, month } = this.getCurrentYearMonth();

    let prevYear = year;
    let prevMonth = this.selectedMonthIndex - 1; // month is 1–12 here

    if (prevMonth === 0) {
      prevYear--;
      prevMonth = 12;
    }

    if (prevYear < 2020) return null;

    // Return correct localStorage key format
    return `budget-${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
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
    this.totalIncome = this.income.reduce((sum, i) => sum + Number(i.planned), 0);
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
    this.incomeTotal = this.income.reduce(
      (sum, inc) => sum + Number(inc.planned || 0),
      0
    );
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
    // Convert empty, null or invalid value → 0
    if (
      item[type] === '' ||
      item[type] === null ||
      item[type] === undefined ||
      isNaN(Number(item[type]))
    ) {
      item[type] = 0.00;
    } else {
      // Ensure number type
      item[type] = Number(item[type]);
    }

    // Close edit mode
    item["edit" + this.capitalize(type)] = false;

    // Recalculate UI + save
    this.onAmountChange();
    this.calculateSummaryPieChart();
    this.saveBudget();  // Save month-wise
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
    this.calculateTotals();

    this.hasEnteredAmount =
      this.totalIncome > 0 || this.totalPlannedExpenses > 0;

    this.budgetShared.updateBudgetInfo({
      totalIncome: this.totalIncome,
      totalPlannedExpenses: this.totalPlannedExpenses,
      amountLeft: this.amountLeft,
      hasEnteredAmount: this.hasEnteredAmount,
      shouldShowSummaryBox: this.shouldShowSummaryBox()
    });
  }

  getMonthKey() {
    return this.getKey(this.selectedYear, this.selectedMonthIndex);
  }

  getKey(year: number, monthIndex: number) {
    return `budget-${year}-${(monthIndex + 1).toString().padStart(2, '0')}`;
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

      // this.logPreviousMonthBudget();
    } else {
      this.resetToZeroValues();
      this.budgetExistsForMonth = forceCreate ? true : false;
    }
    this.rebuildAllCategories();
    this.loadTransactions();
    this.loadSummary();
    this.updateExpenseReceivedFromTransactions();
    this.onAmountChange();
  }
  rebuildAllCategories() {
    this.allCategories = [
      this.savings,
      this.giving,
      this.housing,
      this.tranportation,
      this.food,
      this.personal,
      this.health,
      this.insurance,
      this.loan,
      this.entertainment,
      this.childcare
    ];
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

      const prevKey = `budget-${year}-${(month + 1).toString().padStart(2, '0')}`;
      const saved = localStorage.getItem(prevKey);

      if (saved) {
        const currentKey = this.getMonthKey();        // budget-2025-05
        localStorage.setItem(currentKey, saved);      // Copy without modifying
        this.loadBudgetForMonth();
        return;
      }

      month--;
    }

    console.warn("No previous budget found to copy.");
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
      if (result === 'zero') {
        this.resetAllAmountsToZero();
      } else if (result === 'copy') {
        this.copyLatestBudgetForMonth();
      }
    });
  }

  resetAllAmountsToZero() {
    const allGroups = [
      this.income, this.savings, this.giving, this.housing, this.tranportation,
      this.food, this.personal, this.health, this.insurance, this.loan,
      this.entertainment, this.childcare
    ];

    allGroups.forEach(group => {
      group.forEach(item => {
        item.planned = '0.00';
        item.received = '0.00';
      });
    });

    this.hasEnteredAmount = false;
    this.amountLeft = 0;
    this.totalIncome = 0;
    this.totalPlannedExpenses = 0;

    this.saveBudget();
    this.calculateTotals();

    this.showSuccessPopup("All amounts were reset to ₹0.");
  }

  showSuccessPopup(msg: string) {
    this.successMessage = msg;
    this.successPopup = true;

    setTimeout(() => {
      this.successPopup = false;
    }, 2000); // auto-close after 2 sec
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
    const localValues = values;
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
              const categoryName = context.label;

              // Skip "Remaining"
              if (categoryName === "Remaining") {
                return `Remaining – ${context.raw}%`;
              }
              const index = context.dataIndex;

              // Find category object
              const category = categories.find(c => c.name === categoryName);
              const items = category?.data || [];

              // Total amount for this category
              const totalCategoryAmount = values[index];

              // % of total income
              const categoryPercent = context.raw;

              // Format amount
              const formattedCategoryTotal = new Intl.NumberFormat('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(totalCategoryAmount);

              // Build hierarchical breakdown
              let breakdown = `${categoryName} – ₹${formattedCategoryTotal} (${categoryPercent}%)\n`;

              items.forEach(item => {
                const amt = Number(item.planned || 0);
                const percentInsideCategory =
                  totalCategoryAmount > 0
                    ? ((amt / totalCategoryAmount) * 100).toFixed(1)
                    : 0;

                const formattedAmt = new Intl.NumberFormat('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(amt);

                breakdown += `\n• ${item.name} – ₹${formattedAmt} (${percentInsideCategory}%)`;
              });
              return breakdown;
            }
          }
        }
      }
    };
  }

  getBreakdownText(categoryItems: any[], totalCategoryAmount: number) {
    return categoryItems
      .map(item => {
        const amt = Number(item.planned || 0);
        const percent = totalCategoryAmount > 0 ? ((amt / totalCategoryAmount) * 100).toFixed(1) : 0;
        const formattedAmt = new Intl.NumberFormat('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amt);

        return `• ${item.name} – ₹ ${formattedAmt} (${percent}%)`;
      })
      .join('\n');
  }

  checkPreviousMonthBudget() {
    let prevMonth = this.selectedMonthIndex - 1;
    let prevYear = this.selectedYear;

    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    const prevKey = this.getKey(prevYear, prevMonth);
    this.hasLatestBudget = !!localStorage.getItem(prevKey);
  }

  logPreviousMonthBudget() {
    let year = this.selectedYear;
    let month = this.selectedMonthIndex - 1;   // previous month index

    // Handle year change
    if (month < 0) {
      month = 11;
      year--;
    }

    const prevKey = `budget-${year}-${(month + 1).toString().padStart(2, '0')}`;
    const prevBudget = localStorage.getItem(prevKey);
    if (prevBudget) {
      this.hasLatestBudget = true;
    } else {
      console.warn("No budget found for previous month.");
      this.hasLatestBudget = false;
    }
  }

  openPopup(type: 'income' | 'expense') {
    this.popupType = type;
    this.showPopup = true;
    this.onTypeChange();
  }

  closePopup() {
    this.showPopup = false;
    this.form = { category: '', amount: 0, date: '', description: '' };
  }

  onTypeChange() {
    if (this.popupType === "income") {
      this.selectedCategoryList = this.incomeCategories;
    } else {
      this.selectedCategoryList = this.expenseCategories.flatMap(item =>
        item.sub ? [item.name, ...item.sub] : [item.name]
      );
    }
  }

  submitTransaction() {
    const mainCategory = this.getMainCategory(this.form.category);
    const newItem: Transaction = {
      id: Date.now().toString(),
      icon: this.getIcon(mainCategory),   // ✅ FIX ADDED
      type: this.popupType,
      category: this.form.category,
      amount: Number(this.form.amount),
      date: this.form.date,
      description: this.form.description,
      month: this.selectedMonthIndex,
      year: this.selectedYear
    };
    const data = JSON.parse(localStorage.getItem('smartbudget-data') || '{"transactions":[],"summary":{}}');
    // save transaction
    data.transactions.push(newItem);
    if (this.popupType === 'income') {
      const incomeRow = this.income.find(i => i.name === this.form.category);

      if (incomeRow) {
        const updated =
          Number(incomeRow.received || 0) + Number(this.form.amount || 0);

        incomeRow.received = updated.toFixed(2); // ✅ string
      }

    }
    // update summary
    if (this.popupType === 'expense') {
      if (!data.summary[mainCategory]) {
        data.summary[mainCategory] = {
          allotted: 0,
          spent: 0,
          remain: 0
        };
      }

      data.summary[mainCategory].spent += newItem.amount;
      data.summary[mainCategory].remain =
        data.summary[mainCategory].allotted - data.summary[mainCategory].spent;
    }
    // SAVE
    localStorage.setItem('smartbudget-data', JSON.stringify(data));
    // reload
    this.saveBudget();
    this.onAmountChange();
    this.loadTransactions();
    this.loadSummary();
    this.updateExpenseReceivedFromTransactions();
    this.closePopup();
  }

  loadTransactions() {
    const data = JSON.parse(localStorage.getItem('smartbudget-data') || '{"transactions":[]}');
    this.transactions = data.transactions;
    this.transactions = data.transactions
      .filter((t: Transaction) =>
        t.month === this.selectedMonthIndex &&
        t.year === this.selectedYear
      )
      .sort((a: Transaction, b: Transaction) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }

  loadSummary() {
    const data = JSON.parse(
      localStorage.getItem('smartbudget-data') || '{"transactions":[]}'
    );

    const monthTransactions = data.transactions.filter(
      (t: Transaction) =>
        t.type === 'expense' &&
        t.month === this.selectedMonthIndex &&
        t.year === this.selectedYear
    );

    const summary: Record<string, SummaryItem> = {};
    monthTransactions.forEach((t: Transaction) => {
      const main = this.getMainCategory(t.category);

      if (!summary[main]) {
        summary[main] = { allotted: 0, spent: 0, remain: 0 };
      }

      summary[main].spent += t.amount;
    });

    // Attach allotted from budget
    Object.keys(summary).forEach(cat => {
      const group = this.allCategories.find(g =>
        g.some(i => i.name === cat)
      );
      const allotted =
        group?.reduce((sum, i) => sum + Number(i.planned || 0), 0) || 0;
      summary[cat].allotted = allotted;
      summary[cat].remain = allotted - summary[cat].spent;
    });

    this.summary = summary;
  }

  updateSummary(expense: any) {
    const data = JSON.parse(localStorage.getItem('smartbudget-data') || '{"summary":{}}');
    if (!data.summary[expense.category]) {
      data.summary[expense.category] = {
        allotted: 0,     // or your planned value
        spent: 0,
        remain: 0
      };
    }
    // Update spent
    data.summary[expense.category].spent += expense.amount;
    // Recalculate remain
    data.summary[expense.category].remain =
      data.summary[expense.category].allotted -
      data.summary[expense.category].spent;
    localStorage.setItem('smartbudget-data', JSON.stringify(data));
    this.summary = data.summary;  // Refresh UI
  }

  getIcon(category: string) {
    const map: any = {
      Food: "🍽️",
      Grocery: "🛒",
      Personal: "🧍",
      Entertainment: "🎬",
      Savings: "💰",
      Housing: "🏠",
      Transportation: "🚗",
      Health: "⚕️",
      Giving: "🎁"
    };
    return map[category] || "💡";
  }

  getMainCategory(category: string): string {
    for (let item of this.expenseCategories) {
      // if main category matches
      if (item.name === category) return item.name;

      // if subcategory matches, return main category
      if (item.sub && item.sub.includes(category)) {
        return item.name;
      }
    }
    return category; // for income or unmatched categories
  }

  updateExpenseReceivedFromTransactions() {
    const data = JSON.parse(
      localStorage.getItem('smartbudget-data') || '{"transactions":[]}'
    );

    // 1️⃣ Reset all expense received values
    this.allCategories.forEach(group => {
      group.forEach(item => {
        item.received = '0.00';
      });
    });

    // 2️⃣ Filter current month expenses
    const monthExpenses: Transaction[] = data.transactions.filter(
      (t: Transaction) =>
        t.type === 'expense' &&
        t.month === this.selectedMonthIndex &&
        t.year === this.selectedYear
    );

    // 3️⃣ Add amounts to EXACT matching sub-category
    monthExpenses.forEach((t: Transaction) => {

      const categoryGroup = this.allCategories.find(group =>
        group.some(item => item.name === t.category)
      );

      const categoryItem = categoryGroup?.find(
        item => item.name === t.category
      );

      if (categoryItem) {
        const current = Number(categoryItem.received || 0);
        categoryItem.received = (current + t.amount).toFixed(2);
      }
    });
  }

}
