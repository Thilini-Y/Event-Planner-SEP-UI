import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-budget',
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './view-budget.html',
  styleUrl: './view-budget.css',
})
export class ViewBudget {
  total: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ViewBudget>,
    @Inject(MAT_DIALOG_DATA) public data: { budget: any; eventName: string }
  ) {
    this.total = data.budget.items.reduce((sum: number, item: any) => sum + item.amount, 0);
  }

  close(): void {
    this.dialogRef.close();
  }
}
