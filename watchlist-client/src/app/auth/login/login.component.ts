import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  showLoginFailureMessage = false;
  loginForm: FormGroup;
  error: string = null;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  //Check form validity
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    } else {
      console.log(this.loginForm.value);
      this.loginForm.reset(this.loginForm.value); //clear form
    }

    //obtain user info
    const { email, password } = this.loginForm.value;
    //Uses login function in authService to login
    this.authService.login(email, password).subscribe({
      next: (res) => this.router.navigate(['/movies']).then(),
      error: (errorMessage) => {
        //console.log(errorMessage);
        this.error = errorMessage;
        this.loginFailureMessage();
      },
    });
  }
  private loginFailureMessage() {
    this.showLoginFailureMessage = true;
  }
}
