import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserRole } from '../models/roles';
import { environment } from '../../environments/environment';

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
  private currentRole = new BehaviorSubject<UserRole>(UserRole.CSO);
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
    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, {
      user: user,
      pass: pass
    });
  }

  logout(): void {
    localStorage.removeItem('userRole');
    this.currentRole.next(UserRole.CSO);
    this.isLoggedIn.next(false);
  }

  setRole(role: UserRole): void {
    this.currentRole.next(role);
    this.isLoggedIn.next(true);
    localStorage.setItem('userRole', role);
  }

  getRole(): UserRole {
    return (localStorage.getItem('userRole') as UserRole) || UserRole.CSO;
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
    return this.hasRole(UserRole.CSO, UserRole.SCSO, UserRole.AM);
  }

  canAccessRecruitment(): boolean {
    return this.hasRole(UserRole.HR, UserRole.PM, UserRole.SM);
  }

  canAccessFinancial(): boolean {
    return this.hasRole(UserRole.PM, UserRole.SM, UserRole.FM);
  }

  canAccessTasks(): boolean {
    return this.hasRole(UserRole.PM, UserRole.SM);
  }
}
