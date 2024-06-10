import { Component, Input, OnInit } from '@angular/core';
import { MovieModel } from '../../movie.model';
import { Router } from '@angular/router';
import { MovieService } from '../../movie.service';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.css',
})
export class MovieItemComponent implements OnInit {
  @Input() movie: MovieModel;
  @Input() index: number;

  constructor(
    private movieService: MovieService,
    private router: Router,
  ) {}

  ngOnInit() {}

  onMovieClicked(id: string): void {
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        //console.log('Clicked movie:', movie);
        this.router.navigate(['/movies', movie.id]);
      },
      error: (error) => {
        console.error('Error retrieving movie:', error);
      },
    });
  }
}
