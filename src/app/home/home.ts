import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/roles';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  currentRole!: UserRole;
  userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentRole = this.authService.getRole();
    this.userName = localStorage.getItem('userName') || 'User';
  }

  getRoleLabel(role: UserRole): string {
    const roleLabels: { [key in UserRole]: string } = {
      [UserRole.CO]: 'Custom Officer',
      [UserRole.SCO]: 'Senior Custom Officer',
      [UserRole.AM]: 'Administration Manager',
      [UserRole.FM]: 'Financial Manager',
      [UserRole.PM]: 'Product Manager',
      [UserRole.SM]: 'Services Manager',
      [UserRole.HR]: 'HR Manager',
      [UserRole.FOOD_PROVIDER]: 'Food Provider',
      [UserRole.MUSIC_PROVIDER]: 'Music Provider'
    };
    return roleLabels[role] || role;
  }

  getWelcomeMessage(): string {
    return `Welcome, ${this.userName}!`;
  }

  getRoleDescription(): string {
    const descriptions: { [key in UserRole]: string } = {
      [UserRole.CO]: 'Manage event requests and view event lists',
      [UserRole.SCO]: 'Manage event requests and view event lists',
      [UserRole.AM]: 'View and manage event lists',
      [UserRole.FM]: 'Manage financial requests and view financial lists',
      [UserRole.PM]: 'Manage recruitment requests, financial requests, and tasks',
      [UserRole.SM]: 'Manage recruitment requests, financial requests, and tasks',
      [UserRole.HR]: 'Manage recruitment requests and view recruitment lists',
      [UserRole.FOOD_PROVIDER]: 'View and update food-related task comments',
      [UserRole.MUSIC_PROVIDER]: 'View and update music-related task comments'
    };
    return descriptions[this.currentRole] || 'Access the system features';
  }

  getQuickActions(): { label: string; route: string; icon: string; description: string }[] {
    const actions: { [key in UserRole]: { label: string; route: string; icon: string; description: string }[] } = {
      [UserRole.CO]: [
        { label: 'Event Request', route: '/form', icon: 'event', description: 'Create new event requests' },
        { label: 'Events', route: '/events', icon: 'list', description: 'View all events' }
      ],
      [UserRole.SCO]: [
        { label: 'Event Request', route: '/form', icon: 'event', description: 'Create new event requests' },
        { label: 'Events', route: '/events', icon: 'list', description: 'View all events' }
      ],
      [UserRole.AM]: [
        { label: 'Events', route: '/events', icon: 'list', description: 'View and manage all events' }
      ],
      [UserRole.FM]: [
        { label: 'Events', route: '/events', icon: 'list', description: 'View all events' },
        { label: 'Financial Request', route: '/financial-request', icon: 'attach_money', description: 'Create financial requests' },
        { label: 'Financial List', route: '/financial-list', icon: 'account_balance', description: 'Manage financial requests' }
      ],
      [UserRole.PM]: [
        { label: 'Recruitment Request', route: '/recruitment', icon: 'group_add', description: 'Create recruitment requests' },
        { label: 'Financial Request', route: '/financial-request', icon: 'attach_money', description: 'Create financial requests' },
        { label: 'Create Task', route: '/create-task', icon: 'add_task', description: 'Create new tasks' },
        { label: 'View Tasks', route: '/task-list', icon: 'task', description: 'View all tasks' }
      ],
      [UserRole.SM]: [
        { label: 'Recruitment Request', route: '/recruitment', icon: 'group_add', description: 'Create recruitment requests' },
        { label: 'Financial Request', route: '/financial-request', icon: 'attach_money', description: 'Create financial requests' },
        { label: 'Create Task', route: '/create-task', icon: 'add_task', description: 'Create new tasks' },
        { label: 'View Tasks', route: '/task-list', icon: 'task', description: 'View all tasks' }
      ],
      [UserRole.HR]: [
        { label: 'Recruitment Request', route: '/recruitment', icon: 'group_add', description: 'Create recruitment requests' },
        { label: 'Recruitment List', route: '/recruitment-list', icon: 'people', description: 'Manage recruitment requests' }
      ],
      [UserRole.FOOD_PROVIDER]: [
        { label: 'View Tasks', route: '/task-list', icon: 'task', description: 'View and update food-related tasks' }
      ],
      [UserRole.MUSIC_PROVIDER]: [
        { label: 'View Tasks', route: '/task-list', icon: 'task', description: 'View and update music-related tasks' }
      ]
    };
    return actions[this.currentRole] || [];
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
