import { UserService } from '../user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent implements OnInit {
  userInfo: any;
  authenticated: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((authenticated) => {
      this.authenticated = authenticated;
      if (authenticated) {
        this.loadUserInfo();
      } else {
        // Redirect to login page or handle unauthenticated access
        this.router.navigate(['/login']);
      }
    });
  }
  loadUserInfo() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserInfo(token).subscribe(
        (data) => {
          this.userInfo = data;
        },
        (error) => {
          console.error('Error fetching user info:', error);
          this.router.navigate(['/login']);
        },
      );
    } else {
      // Handle case where token is not available
      this.router.navigate(['/login']);
    }
  }
}
