import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-budget-popup',
  templateUrl: './reset-budget-popup.html',
  styleUrls: ['./reset-budget-popup.scss'],
   imports: [FormsModule, CommonModule,MatDialogModule ],
})
export class ResetBudgetPopupComponent {

  selectedOption: string | null = null;

  @Output() closePopup = new EventEmitter<void>();
  @Output() makeZero = new EventEmitter<void>();
  @Output() copyLast = new EventEmitter<void>();

    constructor(
    private dialogRef: MatDialogRef<ResetBudgetPopupComponent>
  ) {}

  close() {
    this.closePopup.emit();
    this.dialogRef.close(null); 
  }

  confirm() {
    // if (this.selectedOption === 'zero') {
      // this.makeZero.emit(this.selectedOption);
      this.dialogRef.close(this.selectedOption); 

    // }
    // if (this.selectedOption === 'copy') {
    //   this.copyLast.emit();
    // }
  }
}
