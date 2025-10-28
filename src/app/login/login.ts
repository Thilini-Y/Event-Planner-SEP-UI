import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/roles';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  user: string = '';
  pass: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (!this.user || !this.pass) {
      this.snackBar.open('Please enter both username and password', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.isLoading = true;
    
    this.authService.login(this.user, this.pass).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login response:', response); // Debug log
        if (response.success) {
          this.authService.setRole(response.role);
          // Store username for display
          if (response.username) {
            localStorage.setItem('userName', response.username);
          }
          this.snackBar.open(`Login successful! Welcome ${response.username || response.role}`, 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/home']);
        } else {
          this.snackBar.open('Login failed: ' + (response.message || 'Invalid credentials'), 'Close', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error); // Debug log
        this.snackBar.open('Login failed: ' + (error.error?.message || error.message || 'Network error'), 'Close', {
          duration: 3000,
        });
      }
    });
  }
}
