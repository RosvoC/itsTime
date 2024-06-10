import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  message = 'You are not logged in';
  error: string = null;
  userDetails: any;

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserInfo(token).subscribe((data) => {
        this.userDetails = data;
      });
      this.userService.authEmitter.emit(true);
    }
  }
}
