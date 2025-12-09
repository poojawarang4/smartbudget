import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-budget-popup',
  templateUrl: './reset-budget-popup.html',
  styleUrls: ['./reset-budget-popup.scss'],
  imports: [FormsModule, CommonModule, MatDialogModule],
})
export class ResetBudgetPopupComponent {

  selectedOption: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ResetBudgetPopupComponent>
  ) { }

  close() {
    this.dialogRef.close(null);
  }

  confirm() {
    console.log("this.selectedOption",this.selectedOption)
    this.dialogRef.close(this.selectedOption);
  }
}
