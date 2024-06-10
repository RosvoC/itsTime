import { IsEnum, IsNotEmpty } from 'class-validator';
import { MovieGenre } from '../movie-genre.enum';
import { WatchStatus } from '../watch-status.enum';
import { Transform } from 'class-transformer';

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  releaseYear: string;

  rating: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  imagePath: string;

  @IsEnum(MovieGenre)
  @IsNotEmpty()
  genre: MovieGenre;

  @IsEnum(WatchStatus)
  @IsNotEmpty()
  @Transform(({ obj }) => obj?.status || obj?.watchStatus)
  status: WatchStatus;
}
