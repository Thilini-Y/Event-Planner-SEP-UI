import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserRole } from '../models/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentRole = new BehaviorSubject<UserRole>(UserRole.CUSTOM_OFFICER);

  setRole(role: UserRole): void {
    this.currentRole.next(role);
    localStorage.setItem('userRole', role);
  }

  getRole(): UserRole {
    return (localStorage.getItem('userRole') as UserRole) || UserRole.CUSTOM_OFFICER;
  }

  roleChanges() {
    return this.currentRole.asObservable();
  }

  hasRole(...roles: UserRole[]): boolean {
    const current = this.getRole();
    return roles.includes(current);
  }
}
