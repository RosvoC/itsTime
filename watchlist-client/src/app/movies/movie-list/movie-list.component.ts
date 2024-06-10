import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { MovieModel } from '../movie.model';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css',
})
export class MovieListComponent implements OnInit {
  movies: MovieModel[];
  subscription:Subscription
  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.loadMovies()
  }
  loadMovies() {
    this.movieService.getMovies().subscribe(
      (movies: MovieModel[]) => {
        this.movies = movies;
      }
    );
  }
  onAddMovie() {
    this.router.navigate(['new'], { relativeTo: this.route });
    this.loadMovies();
  }
}
