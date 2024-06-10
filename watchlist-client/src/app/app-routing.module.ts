import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { MoviesComponent } from './movies/movies.component';
import { MovieEditComponent } from './movies/movie-edit/movie-edit.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { MailComponent } from './auth/mail/mail.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  { path: 'signup', component: SignupComponent },
  { path: 'verify', component: MailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'movies',
    component: MoviesComponent,
    children: [
      { path: 'new', component: MovieEditComponent },
      { path: ':id', component: MovieDetailsComponent },
      { path: ':id/edit', component: MovieEditComponent },
    ],
  },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
