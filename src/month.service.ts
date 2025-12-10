import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MonthService {
  private monthSubject = new BehaviorSubject<{ monthIndex: number, year: number }>({
    monthIndex: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  selectedMonth$ = this.monthSubject.asObservable();
  private monthSource = new BehaviorSubject({ month: new Date().getMonth(), year: new Date().getFullYear() });
  month$ = this.monthSource.asObservable();
  updateMonth(month: number, year: number) {
    this.monthSource.next({ month, year });
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
