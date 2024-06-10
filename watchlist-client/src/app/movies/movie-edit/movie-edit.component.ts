import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { MovieService } from '../movie.service';
import { Genre } from '../enums/movie-genre.enum';
import { WatchStatus } from '../enums/movie-watchStatus.enum';
import { MovieModel } from '../movie.model';
import {MovieListComponent} from "../movie-list/movie-list.component";

@Component({
  selector: 'app-movie-edit',
  templateUrl: './movie-edit.component.html',
  styleUrls: ['./movie-edit.component.css'],
})
export class MovieEditComponent implements OnInit {
  editMode = false;
  movieForm: FormGroup;
  id: string;
  statusOptions = Object.values(WatchStatus);
  genreOptions = Object.values(Genre);

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = !!this.id;
      this.initForm();
    });
  }

  increaseRating() {
    const currentRating = this.movieForm.get('rating').value;
    if (currentRating < 5) {
      this.movieForm.get('rating').setValue(currentRating + 1);
    }
  }

  decreaseRating() {
    const currentRating = this.movieForm.get('rating').value;
    if (currentRating > 1) {
      this.movieForm.get('rating').setValue(currentRating - 1);
    }
  }

  onSubmit() {
    const movieData:MovieModel = this.movieForm.value;
    if (this.editMode) {
      this.movieService.updateMovieStatus(this.id, movieData).subscribe(() => {
        this.onCancel();
      });
    } else {
      if (this.movieForm.valid) {
        this.movieService.addMovie(movieData).subscribe(() => {
          this.onCancel();
        });
      }
    }
    this.reload();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  reload(){
      window.location.reload();
  }

  isRatingEnabled(): boolean {
    return this.movieForm.get('status').value === WatchStatus.WATCHED;
  }

  numbersOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && !/^\d+$/.test(value)) {
        return { numbersOnly: true };
      }
      return null;
    };
  }

  private initForm() {
    let title = '';
    let releaseYear = null;
    let genre = '';
    let rating = null;
    let status = '';
    let description = '';
    let imagePath = '';

    if (this.editMode) {
      this.movieService.getMovie(this.id).subscribe((movie: MovieModel) => {
        title = movie.title;
        releaseYear = movie.releaseYear;
        genre = movie.genre;
        rating = movie.rating;
        status = movie.status;
        description = movie.description;
        imagePath = movie.imagePath;

        this.movieForm.patchValue({
          title,
          releaseYear,
          genre,
          rating,
          status,
          description,
          imagePath,
        });
      });
    }

    this.movieForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      releaseYear: new FormControl(releaseYear, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        this.numbersOnlyValidator(),
      ]),
      genre: new FormControl(genre, ),
      rating: new FormControl(rating, Validators.pattern(/^[1-5]$/)),
      status: new FormControl(status, Validators.required),
      description: new FormControl(description, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
    });
  }
}
