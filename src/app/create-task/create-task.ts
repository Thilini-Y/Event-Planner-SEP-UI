import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';
import { UserRole } from '../models/roles';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-task',
  imports: [ 
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule, 
    MatSnackBarModule
  ],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTaskComponent implements OnInit {
  task: Task = {
    eventId: 0,
    projectReference: '',
    description: '',
    assignee: '',
    subteam: '',
    comments: '',
    priority: TaskPriority.LOW,
    status: TaskStatus.CREATED
  };

  priorities = [
    { value: TaskPriority.LOW, label: 'LOW' },
    { value: TaskPriority.MEDIUM, label: 'MEDIUM' },
    { value: TaskPriority.HIGH, label: 'HIGH' },
    { value: TaskPriority.CRITICAL, label: 'CRITICAL' }
  ];

  productManagerAssignees = [
    { value: 'Tom', label: 'Tom' },
    { value: 'Mary', label: 'Mary' }
  ];

  serviceManagerAssignees = [
    { value: 'Brad', label: 'Brad' },
    { value: 'Julia', label: 'Julia' }
  ];

  currentUserRole: UserRole = UserRole.CO;

  constructor(
    private taskService: TaskService, 
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();
    this.setDefaultValues();
  }

  setDefaultValues(): void {
    if (this.currentUserRole === UserRole.PM) {
      this.task.subteam = 'Food';
    } else if (this.currentUserRole === UserRole.SM) {
      this.task.subteam = 'Music';
    }
    this.task.status = TaskStatus.CREATED;
    this.task.comments = '';
  }

  get assigneeOptions() {
    if (this.currentUserRole === UserRole.PM) {
      return this.productManagerAssignees;
    } else if (this.currentUserRole === UserRole.SM) {
      return this.serviceManagerAssignees;
    }
    return [];
  }

  onSubmit(): void {
    // Ensure eventId is numeric (coerce if the input provided a string)
    this.task.eventId = Number(this.task.eventId);

    this.taskService.createTask(this.task).subscribe({
      next: (data: Task) => {
        this.showNotification('✅ Task created successfully!', 'success');
        this.resetForm();
      },
      error: (err: any) => {
        this.showNotification('❌ Task information is not valid', 'error');
      },
    });
  }

  resetForm(): void {
    this.task = {
      eventId: 0,
      projectReference: '',
      description: '',
      assignee: '',
      subteam: '',
      comments: '',
      priority: TaskPriority.LOW,
      status: TaskStatus.CREATED
    };
    this.setDefaultValues();
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
