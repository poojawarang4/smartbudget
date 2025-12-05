import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-budget-popup',
  templateUrl: './reset-budget-popup.html',
  styleUrls: ['./reset-budget-popup.scss'],
   imports: [FormsModule, CommonModule],
})
export class ResetBudgetPopupComponent {

  selectedOption: string | null = null;

  @Output() closePopup = new EventEmitter<void>();
  @Output() makeZero = new EventEmitter<void>();
  @Output() copyLast = new EventEmitter<void>();

  close() {
    this.closePopup.emit();
  }

  confirm() {
    if (this.selectedOption === 'zero') {
      this.makeZero.emit();
    }
    if (this.selectedOption === 'copy') {
      this.copyLast.emit();
    }
  }
}
