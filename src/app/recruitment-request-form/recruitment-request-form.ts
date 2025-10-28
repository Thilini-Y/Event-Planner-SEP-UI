import { Component, OnInit } from '@angular/core';
import { RecruitmentRequestService } from '../services/recruitmentRequest.service';
import { RecruitmentRequest, RecruitmentStatus } from '../models/recruitmentRequest.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recruitment-request-form',
  imports: [ 
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule, 
    MatSnackBarModule
  ],
  templateUrl: './recruitment-request-form.html',
  styleUrl: './recruitment-request-form.css',
})
export class RecruitmentRequestForm implements OnInit {
  recruitmentRequest: RecruitmentRequest = {
    contractType: '',
    requestingDepartment: '',
    yearsOfExperience: 0,
    jobTitle: '',
    jobDescription: '',
    status: RecruitmentStatus.OPEN
  };

  contractTypes: string[] = ['FULL_TIME', 'PART_TIME'];
  departments: string[] = ['PRODUCTION', 'SERVICES'];

  constructor(
    private recruitmentRequestService: RecruitmentRequestService, 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit(): void {
    this.recruitmentRequestService.createRecruitmentRequest(this.recruitmentRequest).subscribe({
      next: (data) => {
        this.showNotification('✅ Recruitment request submitted successfully!', 'success');
        this.resetForm();
      },
      error: (err) => {
        this.showNotification('❌ Error submitting recruitment request: ' + err.message, 'error');
      },
    });
  }

  resetForm(): void {
    this.recruitmentRequest = {
      contractType: '',
      requestingDepartment: '',
      yearsOfExperience: 0,
      jobTitle: '',
      jobDescription: '',
      status: RecruitmentStatus.OPEN
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


