import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-budget-dialog',
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './add-budget-dialog.html',
  styleUrl: './add-budget-dialog.css',
})
export class AddBudgetDialog {
  items: BudgetItem[] = [{ description: '', amount: null }];

  constructor(
    public dialogRef: MatDialogRef<AddBudgetDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { eventName: string }
  ) {}

  addItem(): void {
    this.items.push({ description: '', amount: null });
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  save(): void {
    const validItems = this.items.filter(i => i.description && i.amount);
    if (validItems.length === 0) return;
    this.dialogRef.close(validItems);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
