import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-event-form',
  imports: [ 
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm implements OnInit{
  event: Event = {
    recordID: '',
    name: '',
    type: '',
    location: '',
    attendees: 0,
    description: '',
    estimateBudget: 0,
    status: 'PENDING',
    startDate: null,
    endDate: null
  };

  preferences = {
    decorations: false,
    food: false,
    drinks: false,
    photos: false
  };

  events: Event[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  onSubmit(): void {
    const prefs = Object.entries(this.preferences)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(', ');

    this.event.description = `Preferences: ${prefs}`;

    this.eventService.createEvent(this.event).subscribe({
      next: (data) => {
        alert('Event created successfully!');
        this.loadEvents();
        this.resetForm();
      },
      error: (err) => alert('Error creating event: ' + err.message)
    });
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => (this.events = data),
      error: (err) => console.error(err)
    });
  }

  resetForm(): void {
    this.event = { recordID: '', name: '', type: '', location: '', description: '', estimateBudget: 0, status: 'PENDING' , attendees:0, startDate: null, endDate: null};
    this.preferences = { decorations: false, food: false, drinks: false, photos: false };
  }
}
