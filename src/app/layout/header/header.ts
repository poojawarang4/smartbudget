import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  months = [
    { index: 0, name: 'Jan' },
    { index: 1, name: 'Feb' },
    { index: 2, name: 'Mar' },
    { index: 3, name: 'Apr' },
    { index: 4, name: 'May' },
    { index: 5, name: 'Jun' },
    { index: 6, name: 'Jul' },
    { index: 7, name: 'Aug' },
    { index: 8, name: 'Sep' },
    { index: 9, name: 'Oct' },
    { index: 10, name: 'Nov' },
    { index: 11, name: 'Dec' }
  ];

  selectedMonthIndex = new Date().getMonth();
  selectedYear = new Date().getFullYear();

  isMonthPopoverOpen = false;

  // NEW: 9-month list (centered on the selected month)
  visibleMonths: any[] = [];

  ngOnInit() {
    this.updateVisibleMonths();
  }

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
    this.updateVisibleMonths();
    this.isMonthPopoverOpen = false;
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
