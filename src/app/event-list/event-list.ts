import { Component } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event.model';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserRole } from '../models/roles';

@Component({
  selector: 'app-event-list',
  imports: [CommonModule, MatTableModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList {
  events: Event[] = [];
  displayedColumns = ['id', 'name', 'type',  'estimateBudget', 'status'];
  currentRole!: UserRole;

  constructor(private eventService: EventService, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentRole = this.authService.getRole();

    // listen for live changes
    this.authService.roleChanges().subscribe(role => this.currentRole = role);

    this.eventService.getAllEvents().subscribe(data => this.events = data);
  }

  canApprove(): boolean {
    return this.authService.hasRole(UserRole.SENIOR_CUSTOM_OFFICER, UserRole.ADMIN);
  }

 onAccept(event: Event): void {
    this.eventService.updateEventStatus(event.id!, 'ACCEPTED').subscribe({
      next: updated => {
        event.status = updated.status;
      },
      error: err => console.error('Error updating event status', err)
    });
  }

  onReject(event: Event): void {
    this.eventService.updateEventStatus(event.id!, 'REJECTED').subscribe({
      next: updated => {
        event.status = updated.status;
      },
      error: err => console.error('Error updating event status', err)
    });
  }
}
