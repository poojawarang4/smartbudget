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
import { MatGridListModule } from '@angular/material/grid-list';
import { App } from '../../app';
import { AutoFocusDirective } from '../../auto-focus-directive';

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
  imports: [CommonModule, FormsModule, ResetBudgetPopupComponent, NgChartsModule, MatDialogModule, MatGridListModule,
    AutoFocusDirective
  ],
  standalone: true,
  templateUrl: './budget.html',
  styleUrls: ['./budget.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-IN' }
  ]

})
export class Budget implements OnInit {
  showDeletePopup = false;
  deleteIndex: number | null = null;
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
  isEditMode = false;
  editingTransaction: any = null;
  summary: Record<string, SummaryItem> = {};

  expenseCategories: any[] = [
    {
      name: "Savings",
      sub: [
        "Savings",
      ]
    },
    {
      name: "Giving",
      sub: [
        "Giving",
      ]
    },
    {
      name: "Housing",
      sub: [
        "Mortgage",
        "Rent",
        "Water"
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
    {
      name: "Personal",
      sub: [
        "Personal",
      ]
    },
    {
      name: "Insurance",
      sub: ["Health", "Life"]
    },
    {
      name: "Loan Repayment",
      sub: [
        "Loan Repayment",
      ]
    },
    {
      name: "Entertainment",
      sub: [
        "Entertainment",
      ]
    },
    {
      name: "Child Care",
      sub: [
        "Child Care",
      ]
    }
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
  showLeftToast: boolean = false;
  leftMessage: string = "";
  incomeTotal: number = 0;
  allCategories: any[][] = [];
  hasEnteredAmount = false;
  selectedYear = new Date().getFullYear();
  selectedMonthIndex = new Date().getMonth(); // 0-11
  budgetExistsForMonth = true;
  selectedMonth = '';
  expenses: any[] = [];
  showResetPopup = false;
  successPopup = false;
  successMessage = "";
  hasAnyBudget = false;

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
  constructor(private monthService: MonthService, private dialog: MatDialog, private budgetShared: BudgetSharedService,
    private App: App
  ) { }

  ngOnInit() {
    this.hasAnyBudget = this.checkIfAnyBudgetExists();
    this.monthService.selectedMonth$.subscribe(({ month, year }) => {
      this.selectedMonthIndex = month;
      this.selectedYear = year;
      this.selectedMonth = this.getMonthName(month);
      this.loadBudgetForMonth();
      this.loadTransactions();
      this.loadSummary();
      this.hasAnyBudget = this.checkIfAnyBudgetExists();
    });

    this.allCategories = [
      this.savings || [],
      this.giving || [],
      this.housing || [],
      this.tranportation || [],
      this.food || [],
      this.personal || [],
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
        // const key = `budget-${year}-${m}`;
        const key = `budget-${year}-${(m + 1).toString().padStart(2, '0')}`;
        if (localStorage.getItem(key)) return true;
      }
    }
    return false;
  }

  startPlanningForMonth() {
    this.loadBudgetForMonth(true);
  }

  getMonthName(index: number) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[index];
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
      ...this.loan,
      ...this.entertainment,
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
  hasPlannedIncome(): boolean {
    return this.income.some(inc =>
      inc.planned !== null &&
      inc.planned !== undefined &&
      inc.planned !== '' &&
      Number(inc.planned) > 0
    );
  }

  editAmount(item: any, field: 'planned' | 'received', isIncome: boolean) {
    if (!isIncome && !this.hasPlannedIncome()) {
      this.leftMessage = 'Please Enter Income First';
      this.showLeftToast = true;
      setTimeout(() => (this.showLeftToast = false), 2000);
      return;
    }

    const editKey = 'edit' + this.capitalize(field);
    item[editKey] = true;

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
    this.loadSummary();
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
    this.activeTab = 'summary';
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
      this.loan = budget.loan;
      this.entertainment = budget.entertainment;
      this.childcare = budget.childcare;
      this.budgetExistsForMonth = true;
    } else {
      this.resetToZeroValues();
      this.budgetExistsForMonth = forceCreate ? true : false;
    }
    this.rebuildAllCategories();
    this.loadTransactions();
    this.loadSummary();
    this.updateIncomeReceivedFromTransactions();
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
    this.insurance = resetArray(this.insurance);
    this.loan = resetArray(this.loan);
    this.entertainment = resetArray(this.entertainment);
    this.childcare = resetArray(this.childcare);
    this.hasEnteredAmount = false;
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
      insurance: this.insurance,
      loan: this.loan,
      entertainment: this.entertainment,
      childcare: this.childcare
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  copyLatestBudgetForMonth() {
    let latestKey: string | null = null;
    // find latest budget (newest year+month)
    for (let year = 2030; year >= 2020; year--) {
      for (let m = 11; m >= 0; m--) {
        const key = `budget-${year}-${(m + 1).toString().padStart(2, '0')}`;
        if (localStorage.getItem(key)) {
          latestKey = key;
          break;
        }
      }
      if (latestKey) break;
    }
    if (!latestKey) {
      console.warn('No previous budget found');
      return;
    }
    // copy into current month
    const latestBudget = localStorage.getItem(latestKey);
    const currentKey = this.getMonthKey();
    localStorage.setItem(currentKey, latestBudget!);
    // reload UI
    this.loadBudgetForMonth(true);
    this.showSuccessPopup('Latest budget copied successfully');
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
      this.income, this.savings, this.giving, this.housing,
      this.tranportation, this.food, this.personal,
      this.insurance, this.loan, this.entertainment, this.childcare
    ];
    allGroups.forEach(group => {
      group.forEach(item => {
        item.planned = '0.00';
        item.received = '0.00';
      });
    });
    // ✅ Save reset flag for this month
    const resetKey = `budget-reset-${this.selectedYear}-${this.selectedMonthIndex}`;
    localStorage.setItem(resetKey, 'true');
    this.hasEnteredAmount = false;
    this.amountLeft = 0;
    this.totalIncome = 0;
    this.totalPlannedExpenses = 0;
    this.saveBudget();
    this.calculateTotals();
    this.budgetShared.updateBudgetInfo({
      totalIncome: 0,
      totalPlannedExpenses: 0,
      amountLeft: 0,
      hasEnteredAmount: false,
      shouldShowSummaryBox: false
    });
    this.showSuccessPopup("Budget reset to ₹0.00");
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
      { name: 'Insurance', data: this.insurance },
      { name: 'Loan', data: this.loan },
      { name: 'Entertainment', data: this.entertainment },
      { name: 'ChildCare', data: this.childcare }
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

  openPopup(type: 'income' | 'expense') {
    this.isEditMode = false;
    this.editingTransaction = null;
    this.popupType = type;
    this.form = {
      category: '',
      amount: 0,
      date: '',
      description: ''
    };
    this.onTypeChange();
    this.showPopup = true;
    this.App.blurActive = true;
  }

  closePopup() {
    this.showPopup = false;
    this.App.blurActive = false;
    this.isEditMode = false;
    this.editingTransaction = null;
    this.form = { category: '', amount: 0, date: '', description: '' };
  }

  onTypeChange() {
    if (this.popupType === "income") {
      this.selectedCategoryList = this.incomeCategories;
    } else {
      this.selectedCategoryList = this.expenseCategories.filter(c => c.sub)
        .flatMap(c => c.sub!);
    }
  }

  submitTransaction() {
    const transactionDate =
      this.form.date && this.form.date.trim() !== ''
        ? this.form.date
        : new Date().toISOString().split('T')[0]; // today

    const resetKey = `budget-reset-${this.selectedYear}-${this.selectedMonthIndex}`;
    localStorage.removeItem(resetKey);
    const data = JSON.parse(
      localStorage.getItem('smartbudget-data') || '{"transactions":[],"summary":{}}'
    );
    const mainCategory = this.getMainCategory(this.form.category);
    if (this.isEditMode && this.editingTransaction) {
      const index = data.transactions.findIndex(
        (t: Transaction) => t.id === this.editingTransaction!.id
      );
      if (index === -1) return;
      const old = data.transactions[index];
      // 🔁 REVERSE OLD EFFECTS
      if (old.type === 'income') {
        const row = this.income.find(i => i.name === old.category);
        if (row) {
          row.received = (
            Number(row.received || 0) - Number(old.amount)
          ).toFixed(2);
        }
      }
      if (old.type === 'expense') {
        const oldMain = this.getMainCategory(old.category);
        // 🔁 remove from accordion
        this.updateExpenseAccordion(old.category, old.amount, 'remove');
        // 🔁 remove from summary
        if (data.summary[oldMain]) {
          data.summary[oldMain].spent -= old.amount;
          data.summary[oldMain].remain =
            data.summary[oldMain].allotted - data.summary[oldMain].spent;
        }
      }
      // ✏️ CREATE UPDATED TRANSACTION
      const updated: Transaction = {
        ...old,
        category: this.form.category,
        amount: Number(this.form.amount),
        date: this.form.date,
        description: this.form.description,
        type: this.popupType,
        icon: this.getIcon(mainCategory)
      };
      // ✅ REPLACE in storage
      data.transactions[index] = updated;
      // ➕ APPLY NEW EFFECTS
      if (updated.type === 'income') {
        const row = this.income.find(i => i.name === updated.category);
        if (row) {
          row.received = (
            Number(row.received || 0) + updated.amount
          ).toFixed(2);
        }
      }
      if (updated.type === 'expense') {
        // ➕ add to accordion
        this.updateExpenseAccordion(updated.category, updated.amount, 'add');

        // ➕ add to summary
        if (!data.summary[mainCategory]) {
          data.summary[mainCategory] = { allotted: 0, spent: 0, remain: 0 };
        }
        data.summary[mainCategory].spent += updated.amount;
        data.summary[mainCategory].remain =
          data.summary[mainCategory].allotted -
          data.summary[mainCategory].spent;
      }
      this.showSuccess('Transaction updated successfully');
      localStorage.setItem('smartbudget-data', JSON.stringify(data));
      this.saveBudget()
      this.onAmountChange()
      // 🔄 HARD reload from storage
      this.loadTransactions();
      this.loadSummary();
      this.updateIncomeReceivedFromTransactions();
      this.updateExpenseReceivedFromTransactions();
      // this.onAmountChange();
    } else {
      // =========================
      // ➕ ADD TRANSACTION
      // =========================
      const newItem: Transaction = {
        id: Date.now().toString(),
        icon: this.getIcon(mainCategory),
        type: this.popupType,
        category: this.form.category,
        amount: Number(this.form.amount),
        date: transactionDate,
        description: this.form.description,
        month: this.selectedMonthIndex,
        year: this.selectedYear
      };
      data.transactions.push(newItem);
      if (this.popupType === 'expense') {
        // ➕ accordion update
        this.updateExpenseAccordion(
          newItem.category,
          newItem.amount,
          'add'
        );
        // ➕ summary update
        if (!data.summary[mainCategory]) {
          data.summary[mainCategory] = { allotted: 0, spent: 0, remain: 0 };
        }
        data.summary[mainCategory].spent += newItem.amount;
        data.summary[mainCategory].remain =
          data.summary[mainCategory].allotted -
          data.summary[mainCategory].spent;
      }
      this.showSuccess('Transaction added successfully');
    }
    // =========================
    // 💾 SAVE & REFRESH
    // =========================
    localStorage.setItem('smartbudget-data', JSON.stringify(data));
    this.saveBudget();
    this.onAmountChange();
    this.loadTransactions();
    this.loadSummary();
    this.updateIncomeReceivedFromTransactions();
    this.updateExpenseReceivedFromTransactions();
    this.successPopup = true;
    this.closePopup();
  }

  updateExpenseAccordion(category: string, amount: number, mode: 'add' | 'remove') {
    const delta = mode === 'add' ? amount : -amount;
    const main = this.getMainCategory(category);
    if (main === 'Housing') {
      const row = this.housing.find(
        (h: any) => h.name === category
      );
      if (row) row.received += delta;
    }
    if (main === 'Transportation') {
      const row = this.tranportation.find(
        (t: any) => t.name === category
      );
      if (row) row.received += delta;
    }
    // add others if needed (Food, Insurance, etc.)
  }

  showSuccess(message: string, duration = 2000) {
    this.successMessage = message;
    this.successPopup = true;
    setTimeout(() => {
      this.successPopup = false;
      this.successMessage = '';
    }, duration);
  }

  loadTransactions() {
    const data = JSON.parse(localStorage.getItem('smartbudget-data') || '{"transactions":[]}');
    this.transactions = data.transactions;
    this.transactions = data.transactions
      .filter((t: Transaction) =>
        t.month === this.selectedMonthIndex &&
        t.year === this.selectedYear
      )
      .sort((a: Transaction, b: Transaction) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return db - da;
      });
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
      let allotted = 0;

      this.allCategories.forEach(group => {
        group.forEach(item => {
          // map subcategory → main category
          if (this.getMainCategory(item.name) === cat) {
            allotted += Number(item.planned || 0);
          }
        });
      });

      summary[cat].allotted = allotted;
      summary[cat].remain = allotted - summary[cat].spent;
    });

    this.summary = summary;
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

  updateIncomeReceivedFromTransactions() {
    // reset income received
    this.income.forEach(i => (i.received = '0.00'));
    const data = JSON.parse(
      localStorage.getItem('smartbudget-data') || '{"transactions":[]}'
    );
    const monthIncome: Transaction[] = data.transactions.filter(
      (t: Transaction) =>
        t.type === 'income' &&
        t.month === this.selectedMonthIndex &&
        t.year === this.selectedYear
    );
    monthIncome.forEach(t => {
      const row = this.income.find(i => i.name === t.category);
      if (row) {
        row.received = (
          Number(row.received || 0) + t.amount
        ).toFixed(2);
      }
    });
  }

  updateExpenseReceivedFromTransactions() {
    const resetKey = `budget-reset-${this.selectedYear}-${this.selectedMonthIndex}`;
    // ❌ If budget was reset, do NOT recalc received
    if (localStorage.getItem(resetKey) === 'true') {
      return;
    }
    this.allCategories.forEach(group => {
      group.forEach(item => (item.received = '0.00'));
    });
    const data = JSON.parse(
      localStorage.getItem('smartbudget-data') || '{"transactions":[]}'
    );
    const monthExpenses: Transaction[] = data.transactions.filter(
      (t: Transaction) =>
        t.type === 'expense' &&
        t.month === this.selectedMonthIndex &&
        t.year === this.selectedYear
    );
    monthExpenses.forEach(t => {
      // Find the exact category/subcategory in budget arrays
      for (let group of this.allCategories) {
        const item = group.find(i => i.name === t.category); // match exact subcategory
        if (item) {
          item.received = (Number(item.received || 0) + t.amount).toFixed(2);
          break; // stop after first match
        }
      }
    });
  }

  getProgressPercent(value: { spent: number; allotted: number }): number {
    // No budget → show full bar as alert
    if (value.allotted === 0) {
      return 100;
    }
    const percent = (value.spent / value.allotted) * 100;
    // Cap progress at 100%
    return Math.min(percent, 100);
  }

  getProgressClass(value: { spent: number; allotted: number }): string {
    if (value.allotted === 0 && value.spent > 0) {
      return 'red';
    }
    // Over budget
    if (value.spent > value.allotted) {
      return 'red';
    }
    // Within budget
    return 'green';;
  }

  getReceivedClass(item: { planned: string; received: string }): string {
    const planned = Number(item.planned) || 0;
    const received =
      item.received === '' || item.received == null
        ? 0
        : Number(item.received);
    return received > planned ? 'exceed' : '';
  }

  getReceivedDisplay(item: { planned: string; received: string }): string {
    const planned = Number(item.planned) || 0;
    // ✅ Handle empty / undefined received
    const received =
      item.received === '' || item.received == null
        ? 0
        : Number(item.received);
    if (received > planned) {
      // const extra = received - planned;
      return `-₹ ${received.toFixed(2)}`;
    }
    return `₹ ${received.toFixed(2)}`;
  }

  editTransaction(transaction: any) {
    this.isEditMode = true;
    this.editingTransaction = transaction;
    // Detect income or expense
    this.popupType = transaction.type; // 'income' | 'expense'
    // Prepopulate form
    this.form = {
      category: transaction.category,
      amount: transaction.amount,
      date: this.formatDate(transaction.date),
      description: transaction.description
    };
    // Update category dropdown
    this.onTypeChange();
    this.showPopup = true;
    this.App.blurActive = true;
  }

  formatDate(date: string | Date): string {
    if (!date) {
      return '';
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return '';
    }
    return d.toISOString().split('T')[0];
  }

  openDeletePopupFromEdit() {
    this.showPopup = false;
    if (!this.editingTransaction) return;
    const index = this.transactions.findIndex(
      t => t.id === this.editingTransaction.id
    );
    if (index === -1) return;
    this.deleteIndex = index;
    this.showDeletePopup = true;
    this.App.blurActive = true;
  }

  cancelDelete() {
    this.showDeletePopup = false;
    this.deleteIndex = null;
    this.App.blurActive = false;
  }

  confirmDelete() {
    if (this.deleteIndex == null) return;
    const data = JSON.parse(
      localStorage.getItem('smartbudget-data') || '{"transactions":[],"summary":{}}'
    );
    // remove from both UI + saved data
    const t = this.transactions[this.deleteIndex];
    // remove from UI
    this.transactions.splice(this.deleteIndex, 1);
    // remove from smartbudget-data.transactions
    data.transactions = data.transactions.filter(
      (x: any) => x.id !== t.id
    );
    localStorage.setItem('smartbudget-data', JSON.stringify(data));
    // refresh UI
    this.transactions = [...this.transactions];
    this.loadSummary();
    this.updateIncomeReceivedFromTransactions();
    this.updateExpenseReceivedFromTransactions();
    this.onAmountChange();
    this.showDeletePopup = false;
    this.deleteIndex = null;
    this.App.blurActive = false;
  }

}
