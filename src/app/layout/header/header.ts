import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MonthService } from '../../../month.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

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

  selectedMonthIndex = new Date().getMonth();
  selectedYear = new Date().getFullYear();

  isMonthPopoverOpen = false;

  // NEW: 9-month list (centered on the selected month)
  visibleMonths: any[] = [];

  ngOnInit() {
    this.updateVisibleMonths();
  }
  constructor(private monthService: MonthService) { }

  toggleMonthPopover() {
    this.isMonthPopoverOpen = !this.isMonthPopoverOpen;

    if (this.isMonthPopoverOpen) {
      this.updateVisibleMonths();
    }
  }

  /**
   * Build a 9-month sliding window where selected month is always at the center (5th position).
   */
  updateVisibleMonths() {
    const result = [];
    const center = this.selectedMonthIndex;

    for (let offset = -4; offset <= 4; offset++) {
      let monthIndex = center + offset;
      let displayYear = this.selectedYear;

      // Handle previous year
      if (monthIndex < 0) {
        monthIndex = 12 + monthIndex;
        displayYear = this.selectedYear - 1;
      }

      // Handle next year
      if (monthIndex > 11) {
        monthIndex = monthIndex - 12;
        displayYear = this.selectedYear + 1;
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
    this.monthService.updateMonth(selectedMonthName);

    this.isMonthPopoverOpen = false;
    // this.updateVisibleMonths();
    // this.isMonthPopoverOpen = false;
  }

  goToPreviousMonth() {
    if (this.selectedMonthIndex === 0) {
      this.selectedMonthIndex = 11;
      this.selectedYear--;
    } else {
      this.selectedMonthIndex--;
    }
    this.updateVisibleMonths();
  }

  goToNextMonth() {
    if (this.selectedMonthIndex === 11) {
      this.selectedMonthIndex = 0;
      this.selectedYear++;
    } else {
      this.selectedMonthIndex++;
    }
    this.updateVisibleMonths();
  }

}
