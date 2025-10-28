import { Component, OnInit } from '@angular/core';
import { FinancialRequestService } from '../services/financialRequest.service';
import { FinancialRequest, FinancialStatus } from '../models/financialRequest.model';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/roles';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-financial-request-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './financial-request-list.html',
  styleUrl: './financial-request-list.css',
})
export class FinancialRequestList implements OnInit {
  // Make FinancialStatus available in template
  FinancialStatus = FinancialStatus;
  
  displayedColumns: string[] = [
    'projectReference',
    'requestingDepartment',
    'requiredAmount',
    'reason',
    'status',
    'actions'
  ];
  
  dataSource: FinancialRequest[] = [];
  financialRequests: FinancialRequest[] = [];
  statusOptions = Object.values(FinancialStatus);
  currentUserRole!: UserRole;

  constructor(
    private financialRequestService: FinancialRequestService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();
    this.loadFinancialRequests();
  }

  loadFinancialRequests(): void {
    this.financialRequestService.getAllFinancialRequests().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.financialRequests = data;
      },
      error: (err) => {
        console.error(err);
        this.showNotification('❌ Error loading financial requests', 'error');
      }
    });
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const elementId = parseInt(target.getAttribute('data-element-id') || '0', 10);
    const newStatus = target.value;
    
    const element = this.financialRequests.find(r => r.id === elementId);
    if (element && element.id) {
      this.updateStatus(element, newStatus);
    }
  }

  updateStatus(element: FinancialRequest, newStatus: string): void {
    if (element.id) {
      this.financialRequestService.updateFinancialRequestStatus(element.id, newStatus).subscribe({
        next: () => {
          const statusMessage = newStatus === FinancialStatus.APPROVED 
            ? '✅ Request approved successfully' 
            : newStatus === FinancialStatus.REJECTED
            ? '❌ Request rejected'
            : '✅ Status updated successfully';
          this.showNotification(statusMessage, 'success');
          this.loadFinancialRequests();
        },
        error: (err) => {
          this.showNotification('❌ Error updating status: ' + err.message, 'error');
        }
      });
    }
  }

  approveRequest(element: FinancialRequest): void {
    if (element.id) {
      this.updateStatus(element, FinancialStatus.APPROVED);
    }
  }

  rejectRequest(element: FinancialRequest): void {
    if (element.id) {
      this.updateStatus(element, FinancialStatus.REJECTED);
    }
  }

  canChangeStatus(): boolean {
    return this.authService.canChangeFinancialStatus();
  }

  canViewList(): boolean {
    return this.authService.canViewFinancialList();
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case FinancialStatus.PENDING:
        return 'status-pending';
      case FinancialStatus.APPROVED:
        return 'status-approved';
      case FinancialStatus.REJECTED:
        return 'status-rejected';
      default:
        return '';
    }
  }
}

