import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MonthService } from '../../../month.service';
import { BudgetSharedService } from '../budget-shared.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {

  months = [
    { index: 0, name: 'January' },
    { index: 1, name: 'February' },
    { index: 2, name: 'March' },
    { index: 3, name: 'April' },
    { index: 4, name: 'May' },
    { index: 5, name: 'June' },
    { index: 6, name: 'July' },
    { index: 7, name: 'August' },
    { index: 8, name: 'September' },
    { index: 9, name: 'October' },
    { index: 10, name: 'November' },
    { index: 11, name: 'December' }
  ];
  allCategories: any[][] = [];
  selectedMonthIndex = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  isMonthPopoverOpen = false;
  visibleMonths: any[] = [];
  popupCenterMonthIndex: number = this.selectedMonthIndex;
  popupCenterYear: number = this.selectedYear;
  amountLeft: number = 0;
  hasEnteredAmount = false;
  income = [
    { name: 'Salary 1', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Salary 2', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Rental Income', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Investment Income', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false },
    { name: 'Other Income', planned: '0.00', received: '0.00', editPlanned: false, editReceived: false }
  ];
  shouldShow: boolean = false;
  totalIncome: any;

  constructor(private monthService: MonthService, private budgetShared: BudgetSharedService) { }

  ngOnInit() {
    this.updateVisibleMonths();
    this.budgetShared.budgetInfo$.subscribe(info => {
      this.amountLeft = info.amountLeft;
      this.totalIncome = info.totalIncome;
      this.hasEnteredAmount = info.hasEnteredAmount;
      this.shouldShow = info.shouldShowSummaryBox;
    });
  }

  shouldShowSummaryBox(): boolean {
    const hasIncomeAmount =
      this.income.some(i => Number(i.planned) > 0 || Number(i.received) > 0);

    const hasCategoryAmount =
      this.allCategories.some(cat =>
        cat.some(i => Number(i.planned) > 0 || Number(i.received) > 0)
      );
    return hasIncomeAmount || hasCategoryAmount;
  }


  toggleMonthPopover() {
    this.isMonthPopoverOpen = !this.isMonthPopoverOpen;
    if (this.isMonthPopoverOpen) {
      this.popupCenterMonthIndex = this.selectedMonthIndex;
      this.popupCenterYear = this.selectedYear;
      this.updateVisibleMonths();
    }
  }

  /**
   * Build a 9-month sliding window where selected month is always at the center (5th position).
   */
  updateVisibleMonths() {
    const result = [];
    const center = this.popupCenterMonthIndex;
    let centerYear = this.popupCenterYear;

    for (let offset = -4; offset <= 4; offset++) {
      let monthIndex = center + offset;
      let displayYear = centerYear;

      // previous year
      if (monthIndex < 0) {
        monthIndex += 12;
        displayYear--;
      }

      // next year
      if (monthIndex > 11) {
        monthIndex -= 12;
        displayYear++;
      }

      result.push({
        index: monthIndex,
        name: this.months[monthIndex].name,
        year: displayYear,
        isSelected: offset === 0
      });
    }
    this.visibleMonths = result;
  }

  selectMonth(index: number, year: number) {
    this.selectedMonthIndex = index;
    this.selectedYear = year;
    const selectedMonthName = this.months[index].name;
    this.monthService.updateMonth(index, year);
    this.isMonthPopoverOpen = false;
  }

  goToPreviousMonth() {
    if (this.selectedMonthIndex === 0) {
      this.selectedMonthIndex = 11;
      this.selectedYear--;
    } else {
      this.selectedMonthIndex--;
    }
    this.monthService.updateMonth(this.selectedMonthIndex, this.selectedYear);
    this.updateVisibleMonths();
  }

  goToNextMonth() {
    if (this.selectedMonthIndex === 11) {
      this.selectedMonthIndex = 0;
      this.selectedYear++;
    } else {
      this.selectedMonthIndex++;
    }
    this.monthService.updateMonth(this.selectedMonthIndex, this.selectedYear);
    this.updateVisibleMonths();
  }
  goToPopupPreviousMonth() {
    if (this.popupCenterMonthIndex === 0) {
      this.popupCenterMonthIndex = 11;
      this.popupCenterYear--;
    } else {
      this.popupCenterMonthIndex--;
    }
    this.updateVisibleMonths();
  }

  goToPopupNextMonth() {
    if (this.popupCenterMonthIndex === 11) {
      this.popupCenterMonthIndex = 0;
      this.popupCenterYear++;
    } else {
      this.popupCenterMonthIndex++;
    }
    this.updateVisibleMonths();
  }
}
