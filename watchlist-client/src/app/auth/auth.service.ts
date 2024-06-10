import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../user.service';
import { environment } from '../../environments/enviroments';
import { ErrorCodes } from '../error-codes';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private signupUrl = `${environment.backendUrl}/auth/signup`;
  private loginUrl = `${environment.backendUrl}/auth/login`;
  private logoutUrl = `${environment.backendUrl}/auth/logout`;
  private forgotPasswordUrl = `${environment.backendUrl}/auth/forgot-password`;
  private resetPasswordUrl = `${environment.backendUrl}/auth/reset-password`;
  //private verifyUrl = `${environment.backendUrl}/auth/verify`;

  private tokenKey = 'token';

  //BehaviorSubject keeps track of the authentication status.
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken(),
  );
  //The isAuthenticated$observable provides a way to subscribe to changes in the authentication status.
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  signup(
    email: string,
    password: string,
    name: string,
    surname: string,
    idNumber: string,
  ) {
    const signupData = {
      email: email,
      password: password,
      name: name,
      surname: surname,
      idNumber: idNumber,
    };

    return this.http
      .post<{ verificationToken: string }>(this.signupUrl, signupData)
      .pipe(
        tap((response) => {
          if (response && response.verificationToken) {
            localStorage.setItem(this.tokenKey, response.verificationToken);
            console.log('Verification token set:', response.verificationToken);
          }
        }),
        catchError((error) => {
          let errorMessage = 'An unknown error occurred!';
          if (error.status === ErrorCodes.ConflictError) {
            // Email already exists
            errorMessage = 'Authentication failed, please check details';
          }
          return throwError(() => errorMessage);
        }),
      );
  }

  login(email: string, password: string) {
    const loginData = {
      email: email,
      password: password,
    };

    return this.http
      .post<{ accessToken: string }>(this.loginUrl, loginData)
      .pipe(
        tap((response) => {
          if (response && response.accessToken) {
            localStorage.setItem(this.tokenKey, response.accessToken);
            this.userService.getUserInfo(this.tokenKey);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError((errorRes) => {
          let errorMessage = 'Authentication Failed';
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(() => errorMessage);
          }
        }),
      );
  }
  forgotPassword(email: string) {
    return this.http
      .post<{ accessToken: string }>(this.forgotPasswordUrl, { email })
      .pipe(
        catchError((errorRes) => {
          let errorMessage = 'Request failed';
          if (!errorRes.error || !errorRes.error.message) {
            return throwError(() => errorMessage);
          }
          return throwError(() => errorRes.error.message);
        }),
      );
  }
  resetPassword(token: string, newPassword: string) {
    return this.http
      .post(this.resetPasswordUrl, { token, password: newPassword })
      .pipe(
        catchError((errorRes) => {
          let errorMessage = 'Reset password failed';
          if (!errorRes.error || !errorRes.error.message) {
            return throwError(() => errorMessage);
          }
          return throwError(() => errorRes.error.message);
        }),
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    return this.http.post(this.logoutUrl, {}).pipe(
      catchError((errorRes) => {
        let errorMessage = 'An unknown error occurred during logout!';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(() => errorMessage);
        }
      }),
    );
  }

  private hasToken(): boolean {
    return localStorage.getItem(this.tokenKey) !== null;
  }
}
