import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task, TaskStatus, TaskPriority } from '../models/task.model';
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
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  // Make enums available in template
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;
  
  displayedColumns: string[] = [
    'projectReference',
    'description',
    'assignee',
    'subteam',
    'priority',
    'status',
    'comments',
    'actions'
  ];
  
  dataSource: Task[] = [];
  tasks: Task[] = [];
  statusOptions = Object.values(TaskStatus);
  currentUserRole!: UserRole;
  editingComments: { [key: number]: boolean } = {};
  tempComments: { [key: number]: string } = {};

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();
    this.loadTasks();
  }

  loadTasks(): void {
    if (this.isManager()) {
      this.loadManagerTasks();
    } else if (this.isSubteamMember()) {
      this.loadSubteamTasks();
    } else {
      this.showNotification('❌ Access denied: Insufficient permissions', 'error');
    }
  }

  loadManagerTasks(): void {
    const subteam = this.getManagerSubteam();
    
    // Get tasks with NEEDS_MANAGER_REVIEW status
    this.taskService.getTasksByStatus('needs_manager_review').subscribe({
      next: (statusTasks) => {
        // Get tasks with specific subteam
        this.taskService.getTasksBySubteam(subteam).subscribe({
          next: (subteamTasks) => {
            // Find intersection of both lists
            this.dataSource = statusTasks.filter(statusTask => 
              subteamTasks.some(subteamTask => subteamTask.id === statusTask.id)
            );
            this.tasks = [...this.dataSource];
            
            // If no tasks found, show appropriate message
            if (this.dataSource.length === 0) {
              this.showNotification('ℹ️ There are no tasks for review', 'info');
            }
          },
          error: (err) => {
            console.error(err);
            this.showNotification('ℹ️ There are no tasks for review', 'info');
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.showNotification('ℹ️ There are no tasks for review', 'info');
      }
    });
  }

  loadSubteamTasks(): void {
    const subteam = this.getSubteamMemberSubteam();
    
    this.taskService.getTasksBySubteam(subteam).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.tasks = data;
      },
      error: (err) => {
        console.error(err);
        this.showNotification('❌ Task view encountered an error', 'error');
      }
    });
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const elementId = parseInt(target.getAttribute('data-element-id') || '0', 10);
    const newStatus = target.value;
    
    const element = this.tasks.find(t => t.id === elementId);
    if (element && element.id) {
      this.updateStatus(element, newStatus);
    }
  }

  updateStatus(element: Task, newStatus: string): void {
    if (element.id) {
      this.taskService.updateTaskStatus(element.id, newStatus).subscribe({
        next: () => {
          this.showNotification('✅ Status updated successfully', 'success');
          this.loadTasks();
        },
        error: (err) => {
          this.showNotification('❌ Status update failed', 'error');
        }
      });
    }
  }

  startEditingComments(element: Task): void {
    if (element.id) {
      this.editingComments[element.id] = true;
      this.tempComments[element.id] = element.comments || '';
    }
  }

  saveComments(element: Task): void {
    if (element.id && this.tempComments[element.id] !== undefined) {
      this.taskService.updateTaskComments(element.id, this.tempComments[element.id]).subscribe({
        next: () => {
          this.showNotification('✅ Comments updated successfully', 'success');
          if (element.id) {
            this.editingComments[element.id] = false;
          }
          this.loadTasks();
        },
        error: (err) => {
          this.showNotification('❌ Error occurred', 'error');
        }
      });
    }
  }

  cancelEditingComments(element: Task): void {
    if (element.id) {
      this.editingComments[element.id] = false;
      delete this.tempComments[element.id];
    }
  }

  isManager(): boolean {
    return this.currentUserRole === UserRole.PM || this.currentUserRole === UserRole.SM;
  }

  isSubteamMember(): boolean {
    return this.currentUserRole === UserRole.FOOD_PROVIDER || this.currentUserRole === UserRole.MUSIC_PROVIDER;
  }

  getManagerSubteam(): string {
    return this.currentUserRole === UserRole.PM ? 'Food' : 'Music';
  }

  getSubteamMemberSubteam(): string {
    return this.currentUserRole === UserRole.FOOD_PROVIDER ? 'Food' : 'Music';
  }

  canViewTasks(): boolean {
    return this.isManager() || this.isSubteamMember();
  }

  canChangeStatus(): boolean {
    return this.isManager();
  }

  canEditComments(): boolean {
    return this.isSubteamMember();
  }

  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : 
                  type === 'error' ? ['error-snackbar'] : 
                  ['info-snackbar']
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case TaskStatus.IN_PROGRESS:
        return 'status-in-progress';
      case TaskStatus.CREATED:
        return 'status-created';
      case TaskStatus.NEEDS_MANAGER_REVIEW:
        return 'status-needs-review';
      default:
        return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch(priority) {
      case TaskPriority.LOW:
        return 'priority-low';
      case TaskPriority.MEDIUM:
        return 'priority-medium';
      case TaskPriority.HIGH:
        return 'priority-high';
      case TaskPriority.CRITICAL:
        return 'priority-critical';
      default:
        return '';
    }
  }
}
