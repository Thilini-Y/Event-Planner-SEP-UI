import { Component, OnInit } from '@angular/core';
import { RecruitmentRequestService } from '../services/recruitmentRequest.service';
import { RecruitmentRequest, RecruitmentStatus } from '../models/recruitmentRequest.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-recruitment-request-list',
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
  templateUrl: './recruitment-request-list.html',
  styleUrl: './recruitment-request-list.css',
})
export class RecruitmentRequestList implements OnInit {
  displayedColumns: string[] = [
    'jobTitle',
    'requestingDepartment',
    'contractType',
    'yearsOfExperience',
    'status',
    'actions'
  ];
  
  dataSource: RecruitmentRequest[] = [];
  recruitmentRequests: RecruitmentRequest[] = [];
  statusOptions = Object.values(RecruitmentStatus);

  constructor(
    private recruitmentRequestService: RecruitmentRequestService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRecruitmentRequests();
  }

  loadRecruitmentRequests(): void {
    this.recruitmentRequestService.getAllRecruitmentRequests().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.recruitmentRequests = data;
      },
      error: (err) => {
        console.error(err);
        this.showNotification('❌ Error loading recruitment requests', 'error');
      }
    });
  }

  updateStatus(element: RecruitmentRequest, newStatus: string): void {
    if (element.id) {
      this.recruitmentRequestService.updateRecruitmentRequestStatus(element.id, newStatus).subscribe({
        next: () => {
          this.showNotification('✅ Status updated successfully', 'success');
          this.loadRecruitmentRequests();
        },
        error: (err) => {
          this.showNotification('❌ Error updating status: ' + err.message, 'error');
        }
      });
    }
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
      case RecruitmentStatus.OPEN:
        return 'status-open';
      case RecruitmentStatus.IN_PROGRESS:
        return 'status-in-progress';
      case RecruitmentStatus.CLOSED:
        return 'status-closed';
      case RecruitmentStatus.REJECTED:
        return 'status-rejected';
      default:
        return '';
    }
  }
}

