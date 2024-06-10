import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service'; // Import your AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  error: string = null;
  signupFailureMessage: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.alphabetsOnlyValidator(),
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.alphabetsOnlyValidator(),
        ],
      ],
      idNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13),
          this.numbersOnlyValidator(),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordStrengthValidator(),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    const { name, surname, idNumber, email, password } = this.signupForm.value;

    this.authService
      .signup(email, password, name, surname, idNumber)
      .subscribe({
        next: (resData) => {
          this.signupForm.reset();
          this.signupFailureMessage = null; // Clear any previous error message
          this.router.navigate(['/verify']).then();
        },
        error: (errorMessage) => {
          this.signupFailureMessage = errorMessage;
        },
      });
  }

  alphabetsOnlyValidator(): Validators {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (value && !/^[a-zA-Z]+$/.test(value)) {
        return { alphabetsOnly: true };
      }

      return null;
    };
  }

  numbersOnlyValidator(): Validators {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (value && !/^\d+$/.test(value)) {
        return { digitsOnly: true };
      }

      return null;
    };
  }
  passwordStrengthValidator(): Validators {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (value && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(value)) {
        return { passwordStrength: true };
      }

      return null;
    };
  }
}
