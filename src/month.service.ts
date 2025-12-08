import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MonthService {

  // Default → full month name
  // private currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

  // private selectedMonthSource = new BehaviorSubject<string>(this.getCurrentMonth());
  private monthSubject = new BehaviorSubject<{monthIndex: number, year: number}>({
  monthIndex: new Date().getMonth(),
  year: new Date().getFullYear()
});
  selectedMonth$ = this.monthSubject.asObservable();

  updateMonth(monthIndex: number, year: number) {
    this.monthSubject.next({monthIndex,year});
  }
  getCurrentMonth() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[new Date().getMonth()];
  }

  private startPlanningSubject = new BehaviorSubject<boolean>(false);
  startPlanning$ = this.startPlanningSubject.asObservable();

  triggerStartPlanning() {
    this.startPlanningSubject.next(true);
  }
}
