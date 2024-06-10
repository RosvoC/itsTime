import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movie.entity';
import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ErrorCodes } from '../errorCodes';
import { User } from '../auth/user.entity';
import { GetMoviesFilterDto } from './dto/get-movies-filter-dto';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  constructor(private dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }

  async getMovies(filterDto: GetMoviesFilterDto, user: User): Promise<Movie[]> {
    const movieQuery = this.createQueryBuilder('movie');
    const { status, search } = filterDto;
    movieQuery.where({ user: user });
    if (status) {
      movieQuery.andWhere('task.status = :status', { status });
    }

    if (search) {
      movieQuery.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    return await movieQuery.getMany();
  }
  async createMovie(
    createMovieDto: CreateMovieDto,
    user: User,
  ): Promise<Movie> {
    const {
      title,
      releaseYear,
      description,
      rating,
      imagePath,
      genre,
      status,
    } = createMovieDto;
    const movie = this.create({
      title,
      releaseYear,
      rating,
      description,
      status,
      imagePath,
      genre,
      user,
    });
    try {
      await this.save(movie);
      return movie;
    } catch (error) {
      if (error.code === ErrorCodes.conflictError) {
        throw new ConflictException('Movie already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
