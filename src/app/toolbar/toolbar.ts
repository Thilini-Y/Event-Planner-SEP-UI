import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/roles';

@Component({
  selector: 'app-toolbar',
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar implements OnInit {
  allRoles = [
    { value: UserRole.CSO, label: 'CSO' },
    { value: UserRole.SCSO, label: 'SCSO' },
    { value: UserRole.AM, label: 'AM (Admin)' },
    { value: UserRole.FM, label: 'FM (Financial Manager)' },
    { value: UserRole.PM, label: 'PM (Product Manager)' },
    { value: UserRole.SM, label: 'SM (Services Manager)' },
    { value: UserRole.HR, label: 'HR' }
  ];
  selectedRole!: UserRole;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedRole = this.authService.getRole();
    this.isLoggedIn = this.authService.getRole() !== UserRole.CSO || localStorage.getItem('userRole') !== null;

    this.authService.roleChanges().subscribe(role => {
      this.selectedRole = role;
    });

    this.authService.isLoggedInChanges().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  getRoleLabel(role: UserRole): string {
    const roleObj = this.allRoles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  canAccessEvents(): boolean {
    return this.authService.canAccessEvents();
  }

  canAccessRecruitment(): boolean {
    return this.authService.canAccessRecruitment();
  }

  canAccessFinancial(): boolean {
    return this.authService.canAccessFinancial();
  }

  canAccessTasks(): boolean {
    return this.authService.canAccessTasks();
  }
}
