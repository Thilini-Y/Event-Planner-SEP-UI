import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserRole } from '../models/roles';

export interface LoginResponse {
  success: boolean;
  role: UserRole;
  username?: string;
  department?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/login'
  private currentRole = new BehaviorSubject<UserRole>(UserRole.CO);
  private isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole) {
      this.currentRole.next(savedRole);
      this.isLoggedIn.next(true);
    }
  }

  login(user: string, pass: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, {
      user: user,
      pass: pass
    });
  }

  logout(): void {
    localStorage.removeItem('userRole');
    this.currentRole.next(UserRole.CO);
    this.isLoggedIn.next(false);
  }

  setRole(role: UserRole): void {
    this.currentRole.next(role);
    this.isLoggedIn.next(true);
    localStorage.setItem('userRole', role);
  }

  getRole(): UserRole {
    return (localStorage.getItem('userRole') as UserRole) || UserRole.CO;
  }

  roleChanges(): Observable<UserRole> {
    return this.currentRole.asObservable();
  }

  isLoggedInChanges(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  hasRole(...roles: UserRole[]): boolean {
    const current = this.getRole();
    return roles.includes(current);
  }

  // Role-based access control methods
  canAccessEvents(): boolean {
    return this.hasRole(UserRole.CO, UserRole.SCO, UserRole.FM, UserRole.AM);
  }

  canAccessEventRequest(): boolean {
    return this.hasRole(UserRole.CO, UserRole.SCO);
  }

  canAccessEventList(): boolean {
    return this.hasRole(UserRole.CO, UserRole.SCO, UserRole.FM, UserRole.AM);
  }

  canAccessRecruitment(): boolean {
    return this.hasRole(UserRole.HR, UserRole.PM, UserRole.SM);
  }

  canAccessRecruitmentList(): boolean {
    return this.hasRole(UserRole.HR);
  }

  canViewRecruitmentList(): boolean {
    return this.hasRole(UserRole.HR, UserRole.PM, UserRole.SM);
  }

  canChangeRecruitmentStatus(): boolean {
    return this.hasRole(UserRole.HR);
  }

  canAccessFinancial(): boolean {
    return this.hasRole(UserRole.PM, UserRole.SM, UserRole.FM);
  }

  canAccessFinancialList(): boolean {
    return this.hasRole(UserRole.FM);
  }

  canViewFinancialList(): boolean {
    return this.hasRole(UserRole.FM, UserRole.PM, UserRole.SM);
  }

  canChangeFinancialStatus(): boolean {
    return this.hasRole(UserRole.FM);
  }

  canAccessTasks(): boolean {
    return this.hasRole(UserRole.PM, UserRole.SM);
  }

  canViewTasks(): boolean {
    return this.hasRole(UserRole.PM, UserRole.SM, UserRole.FOOD, UserRole.MUSIC);
  }

  canChangeTaskStatus(): boolean {
    return this.hasRole(UserRole.PM, UserRole.SM);
  }

  canEditTaskComments(): boolean {
    return this.hasRole(UserRole.FOOD, UserRole.MUSIC);
  }
}
