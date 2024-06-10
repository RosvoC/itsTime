import { WatchStatus } from './enums/movie-watchStatus.enum';
import { Genre } from './enums/movie-genre.enum';

export class MovieModel {
  public id: string;
  public title: string;
  public releaseYear: number;
  public genre: Genre;
  public rating: number;
  public status: WatchStatus;
  public description: string;
  public imagePath: string;

  constructor(
    id: string,
    title: string,
    releaseYear: number,
    genre: Genre,
    rating: number,
    status: WatchStatus,
    description: string,
    imagePath: string,
  ) {
    this.id = id;
    this.title = title;
    this.releaseYear = releaseYear;
    this.genre = genre;
    this.rating = rating;
    this.status = status;
    this.description = description;
    this.imagePath = imagePath;
  }
}
