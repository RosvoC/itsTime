import { Component, OnInit } from '@angular/core';
import { MovieModel } from '../movie.model';
import { MovieService } from '../movie.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  movie: MovieModel;
  id: string;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.movieService.getMovie(this.id).subscribe((movie: MovieModel) => {
        this.movie = movie;
      });
    });
  }

  onEditMovie() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteMovie() {
    this.movieService.deleteMovie(this.id).subscribe(() => {
      this.router.navigate(['/movies']);
    });
  }
}
