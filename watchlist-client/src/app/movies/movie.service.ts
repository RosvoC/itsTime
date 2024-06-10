import { MovieModel } from './movie.model';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorCodes } from '../error-codes';
import { environment } from '../../environments/enviroments';

@Injectable()
export class MovieService {
  moviesChanged = new Subject<MovieModel[]>();
  private movies: MovieModel[] = [];
  private moviesUrl = `${environment.backendUrl}/movies`;
  private newMovieUrl = `${environment.backendUrl}/movies/new`;
  private movieGenreUrl = `${environment.backendUrl}/movies/genre`;

  constructor(private http: HttpClient) {}

  addMovie(movie: MovieModel) {
    return this.http.post<MovieModel>(this.newMovieUrl, movie).pipe(
      tap((addedMovie: MovieModel) => {
        this.movies.push(addedMovie);
        this.moviesChanged.next([...this.movies]);
        //console.log(addedMovie);
      }),
      catchError((error) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.status === ErrorCodes.ConflictError) {
          errorMessage = 'Movie already exists';
        }
        return throwError(() => errorMessage);
      }),
    );
  }

  getMovieById(id: string): Observable<MovieModel> {
    const url = `${this.moviesUrl}/${id}`;
    return this.http.get<MovieModel>(url);
  }

  getMovie(id: string) {
    const url: string = `${this.moviesUrl}/${id}`;
    return this.http.get(url).pipe(
        catchError((error) => {
          let errorMessage = 'An unknown error occurred!';
          if (error.status === ErrorCodes.NotFoundError) {
            errorMessage = `Movie with ID '${id}' not found`;
          }
          return throwError(() => errorMessage);
        }),
      );
  }

  getMovies() {
    return this.http.get<MovieModel[]>(this.moviesUrl).pipe(
      catchError((error) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.status === ErrorCodes.NotFoundError) {
          errorMessage = 'No movies found';
        }
        return throwError(() => errorMessage);
      }),
    );
  }

  updateMovieStatus(id: string, editedMovie: Partial<MovieModel>) {
    const url = `${this.moviesUrl}/${id}/status`;
    return this.http
      .patch<MovieModel>(url, {
        ...editedMovie,
        status: editedMovie.status,
      })
      .pipe(
        catchError((error) => {
          let errorMessage = 'An unknown error occurred!';
          if (error.status === ErrorCodes.ConflictError) {
            errorMessage = 'Update failed';
          }
          return throwError(() => errorMessage);
        }),
      );
  }

  deleteMovie(id: string) {
    const url = `${this.moviesUrl}/${id}`;
    return this.http.delete(url).pipe(
      tap(() => {
        const index = this.movies.findIndex(movie => movie.id === id);
        if (index !== -1) {
          this.movies.splice(index, 1); // Remove deleted movie from the array
          this.moviesChanged.next([...this.movies]); // Emitting a copy of the updated movies array
        }
      }),
      catchError((error) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.status === ErrorCodes.ConflictError) {
          errorMessage = `Failed to delete movie with ID ${id}`;
        }
        return throwError(() => errorMessage);
      }),
    );
  }
}
