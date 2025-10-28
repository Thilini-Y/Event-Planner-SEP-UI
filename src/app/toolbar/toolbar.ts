import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
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
export class Toolbar {
  roles = [
    { value: UserRole.SENIOR_CUSTOM_OFFICER, label: 'Senior Custom Officer' },
    { value: UserRole.CUSTOM_OFFICER, label: 'Custom Officer' },
    { value: UserRole.ADMINISTRATION_MANAGER, label: 'Administration Manager' },
    { value: UserRole.PROJECT_MANAGER, label: 'Project Manager'},
    { value: UserRole.FINANCIAL_MANAGER, label: 'Financial Manager'},
    { value: UserRole.HR_MANAGER, label: 'HR Manager'}, 
    { value: UserRole.EMPLOYEE, label: 'Employee'}
  ];
  selectedRole!: UserRole;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.selectedRole = this.authService.getRole();

    this.authService.roleChanges().subscribe(role => {
      this.selectedRole = role;
    });
  }

  onRoleChange(role: UserRole): void {
    this.authService.setRole(role);
  }
}
