import { Component } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event.model';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserRole } from '../models/roles';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AddBudgetDialog } from '../components/add-budget-dialog/add-budget-dialog';
import { ViewBudget } from '../components/view-budget/view-budget';

@Component({
  selector: 'app-event-list',
  imports: [CommonModule, MatTableModule, MatSnackBarModule, MatDialogModule, MatIconModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList {
  events: Event[] = [];
  displayedColumns = ['id', 'name', 'type',  'estimateBudget', 'status'];
  currentRole!: UserRole;

  constructor(private eventService: EventService, private authService: AuthService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.currentRole = this.authService.getRole();

    this.authService.roleChanges().subscribe(role => {
      this.currentRole = role;
      this.loadEvents();
    });

    this.loadEvents();
  }

  canAccept(): boolean {
    return this.authService.hasRole(UserRole.SCO);
  }
  canApprove(): boolean {
    return this.authService.hasRole(UserRole.AM);
  }

  isFinanceManager(): boolean {
    return this.authService.hasRole(UserRole.FM);
  }
  isSeniorManager(): boolean {
      return this.authService.hasRole(UserRole.SCO);
  }

 onAccept(event: Event): void {
    this.showNotification('✅ Approved the Event!', 'success');

    this.eventService.updateEventStatus(event.id!, 'ACCEPTED').subscribe({
      next: updated => {
        event.status = updated.status;
      },
      error: err => console.error('Error updating event status', err)
    });
  }

   onApprove(event: Event): void {
    this.showNotification('✅ Approved the Event!', 'success');

    this.eventService.updateEventStatus(event.id!, 'APPROVED').subscribe({
      next: updated => {
        event.status = updated.status;
      },
      error: err => console.error('Error updating event status', err)
    });
  }

  onReject(event: Event): void {
    this.showNotification('❌ Rejected the event!', 'error');

    this.eventService.updateEventStatus(event.id!, 'REJECTED').subscribe({
      next: updated => {
        event.status = updated.status;
      },
      error: err => console.error('Error updating event status', err)
    });
  }

loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = this.filterEventsByRole(data);
      },
      error: (err) => console.error('Failed to load events', err)
    });
  }

  /** ✅ Filter logic per role */
  private filterEventsByRole(events: Event[]): Event[] {
    if (this.isFinanceManager()) {
      return events.filter(e => e.status === 'ACCEPTED' || e.status === 'BUDGETED');
    }

    if (this.isSeniorManager()) {
      return events.filter(e =>
        e.status === 'PENDING' || e.status === 'ACCEPTED' || e.status === 'REJECTED' || e.status === 'BUDGETED' || e.status === 'APPROVED'
      );
    }

    return events;
  }
  handleBudgetClick(event: Event): void {
    if (event.budget && event.budget.items?.length > 0) {
      this.dialog.open(ViewBudget, {
        width: '550px',
        data: { budget: event.budget, eventName: event.name }
      });
    } else {
      this.openBudgetDialog(event);
    }
  }

  openBudgetDialog(event: Event): void {
    const dialogRef = this.dialog.open(AddBudgetDialog, {
      width: '500px',
      data: { eventName: event.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        const payload = {
          status: 'BUDGETED',
          budget: {
            description: 'Initial Budget Plan for ' + event.name,
            items: result
          }
        };

        this.eventService.updateEventBudget(event.id!, payload).subscribe({
          next: updated => {
            event.status = updated.status;
            event.budget = updated.budget;
            this.showNotification('💰 Budget added successfully!', 'success');
            this.loadEvents();
          },
          error: () => this.showNotification('❌ Failed to add budget.', 'error')
        });
      }
    });
  }


  saveBudget(event: Event): void {
    if (event.tempBudget == null) return;
    this.eventService.updateEventBudget(event.id!, { estimateBudget: event.tempBudget }).subscribe({
      next: updated => {
        event.estimateBudget = updated.estimateBudget;
        event.isEditingBudget = false;
        this.showNotification('💰 Budget updated successfully!', 'success');
      },
      error: err => {
        console.error('Error updating budget', err);
        this.showNotification('❌ Failed to update budget.', 'error');
      }
    });
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
