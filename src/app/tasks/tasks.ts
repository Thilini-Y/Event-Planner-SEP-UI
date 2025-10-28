import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent {
  // Placeholder component for tasks functionality
  // This can be expanded later with actual task management features
}
