import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MonthService {

  // Default → full month name
  private currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

  private selectedMonthSource = new BehaviorSubject<string>(this.currentMonth);
  selectedMonth$ = this.selectedMonthSource.asObservable();

  updateMonth(month: string) {
    this.selectedMonthSource.next(month);
  }
}
