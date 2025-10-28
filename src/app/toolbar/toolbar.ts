import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/roles';

@Component({
  selector: 'app-toolbar',
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatSelectModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar implements OnInit {
  allRoles = [
    { value: UserRole.CO, label: 'CO' },
    { value: UserRole.SCO, label: 'SCO' },
    { value: UserRole.AM, label: 'AM (Admin)' },
    { value: UserRole.FM, label: 'FM (Financial Manager)' },
    { value: UserRole.PM, label: 'PM (Product Manager)' },
    { value: UserRole.SM, label: 'SM (Services Manager)' },
    { value: UserRole.HR, label: 'HR' },
    { value: UserRole.FOOD, label: 'Food' },
    { value: UserRole.MUSIC, label: 'Music' }
  ];
  roles: { value: UserRole; label: string }[] = [];
  selectedRole!: UserRole;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedRole = this.authService.getRole();
    this.isLoggedIn = this.authService.getRole() !== UserRole.CO || localStorage.getItem('userRole') !== null;

    // Filter roles to only show the current user's role
    this.updateAvailableRoles();

    this.authService.roleChanges().subscribe(role => {
      this.selectedRole = role;
      this.updateAvailableRoles();
    });

    this.authService.isLoggedInChanges().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  updateAvailableRoles(): void {
    const currentRole = this.authService.getRole();
    // Only show the current user's role in the dropdown
    this.roles = this.allRoles.filter(role => role.value === currentRole);
  }

  onRoleChange(role: UserRole): void {
    this.authService.setRole(role);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  canAccessEvents(): boolean {
    return this.authService.canAccessEvents();
  }

  canAccessEventRequest(): boolean {
    return this.authService.canAccessEventRequest();
  }

  canAccessEventList(): boolean {
    return this.authService.canAccessEventList();
  }

  canAccessRecruitment(): boolean {
    return this.authService.canAccessRecruitment();
  }

  canAccessRecruitmentList(): boolean {
    return this.authService.canAccessRecruitmentList();
  }

  canViewRecruitmentList(): boolean {
    return this.authService.canViewRecruitmentList();
  }

  canChangeRecruitmentStatus(): boolean {
    return this.authService.canChangeRecruitmentStatus();
  }

  canAccessFinancial(): boolean {
    return this.authService.canAccessFinancial();
  }

  canAccessFinancialList(): boolean {
    return this.authService.canAccessFinancialList();
  }

  canViewFinancialList(): boolean {
    return this.authService.canViewFinancialList();
  }

  canChangeFinancialStatus(): boolean {
    return this.authService.canChangeFinancialStatus();
  }

  canAccessTasks(): boolean {
    return this.authService.canAccessTasks();
  }

  canViewTasks(): boolean {
    return this.authService.canViewTasks();
  }
}
