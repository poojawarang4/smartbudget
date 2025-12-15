import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetSharedService {

  private budgetInfoSubject = new BehaviorSubject<any>({
    totalIncome: 0,
    totalPlannedExpenses: 0,
    amountLeft: 0,
    hasEnteredAmount: false,
    shouldShowSummaryBox: false
  });

  budgetInfo$ = this.budgetInfoSubject.asObservable();

  updateBudgetInfo(info: any) {
    this.budgetInfoSubject.next(info);
  }
}
