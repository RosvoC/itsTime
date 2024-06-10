import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  authenticated = false;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((authStatus) => {
      this.authenticated = authStatus;
    });
  }

  onLogout() {
    this.authService.logout(); // Emit authentication status
    this.router.navigate(['/login']).then(
      () => {
        // Redirect to the login page successful
      },
      (error) => {
        console.error('Error navigating to login page:', error);
      },
    );
  }
}
