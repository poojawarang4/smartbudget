import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-budget',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './budget.html',
  styleUrls: ['./budget.scss'],
})
export class Budget {
  isOpen = false;
  isOpeni = false;
  isExp = false;
  isExpand = false
  totalIncome: number = 0;
  totalPlannedExpenses: number = 0;
  budgetStatus: string = "";
  amountLeft: number = 0;
  income = [
    { name: 'Salary 1', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
    { name: 'Salary 2', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
    { name: 'Rental Income', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
    { name: 'Investment Income', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
    { name: 'Other Income', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false }
  ];


  housing = [
    { name: 'Mortgage', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
    { name: 'Rent', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
    { name: 'Water', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false }
  ];

  tranportation = [
    { name: 'Fuel', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
    { name: 'Insurance', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
    { name: 'Maintenance', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
  ];
  food = [
    { name: 'Groceries', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
    { name: 'Restaurants', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
  ];
  insurance = [
    { name: 'Health', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
    { name: 'Life', planned: 'Rs.0.00', received: 'Rs.0.00', editPlanned: false, editReceived: false },
  ];
  isPopoverOpen = false;
  editValue: any = '';
  selectedItem: any = null;
  selectedField: 'planned' | 'received' | null = null;
  popoverX = 0;
  popoverY = 0;

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
      ...this.insurance
    ];

    this.totalPlannedExpenses = allCategories.reduce(
      (sum, i) => sum + Number(i.planned), 0
    );

    // 3. Balance
    this.amountLeft = this.totalIncome - this.totalPlannedExpenses;

    // 4. Budget Status
    if (this.amountLeft > 0) {
      this.budgetStatus = "Amount left to budget";
    } else if (this.amountLeft === 0) {
      this.budgetStatus = "You've Got a Budget!";
    } else {
      this.budgetStatus = "Amount over budget";
    }
  }

}
