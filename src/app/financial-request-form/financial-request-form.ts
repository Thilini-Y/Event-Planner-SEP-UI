import { Component, OnInit } from '@angular/core';
import { FinancialRequestService } from '../services/financialRequest.service';
import { FinancialRequest, FinancialStatus } from '../models/financialRequest.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-financial-request-form',
  imports: [ 
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule, 
    MatSnackBarModule
  ],
  templateUrl: './financial-request-form.html',
  styleUrl: './financial-request-form.css',
})
export class FinancialRequestForm implements OnInit {
  financialRequest: FinancialRequest = {
    requestingDepartment: '',
    projectReference: '',
    requiredAmount: 0,
    reason: '',
    status: FinancialStatus.PENDING
  };

  departments: string[] = ['PRODUCTION', 'SERVICES'];

  constructor(
    private financialRequestService: FinancialRequestService, 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit(): void {
    this.financialRequestService.createFinancialRequest(this.financialRequest).subscribe({
      next: (data) => {
        this.showNotification('✅ Financial request submitted successfully!', 'success');
        this.resetForm();
      },
      error: (err) => {
        this.showNotification('❌ Error submitting financial request: ' + err.message, 'error');
      },
    });
  }

  resetForm(): void {
    this.financialRequest = {
      requestingDepartment: '',
      projectReference: '',
      requiredAmount: 0,
      reason: '',
      status: FinancialStatus.PENDING
    };
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}

