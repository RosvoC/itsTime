import { Injectable, NotFoundException } from '@nestjs/common';
import { MovieRepository } from './movie.repository';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { User } from '../auth/user.entity';
import { GetMoviesFilterDto } from './dto/get-movies-filter-dto';
import { UpdateMovieDetailsDto } from './dto/update-movie-details.dto';

@Injectable()
export class MovieService {
  constructor(private movieRepository: MovieRepository) {}
  async getMovieById(id: string, user: User): Promise<Movie> {
    const found = await this.movieRepository.findOne({
      where: { id: id, user: user },
    });
    if (!found) {
      throw new NotFoundException('Task with ID "$(id)" not found');
    }
    return found;
  }

  getMovies(filterDto: GetMoviesFilterDto, user: User): Promise<Movie[]> {
    return this.movieRepository.getMovies(filterDto, user);
  }
  createMovie(createMovieDto: CreateMovieDto, user: User): Promise<Movie> {
    return this.movieRepository.createMovie(createMovieDto, user);
  }
  async deleteMovie(id: string, user: User): Promise<void> {
    const result = await this.movieRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID "${id}" not found`);
    }
  }

  async updateMovieDetails(
    id: string,
    dto: UpdateMovieDetailsDto,
    user: User,
  ): Promise<Movie> {
    const movie: Movie = await this.getMovieById(id, user); //check if movie exists
    movie.status = dto.status;
    movie.rating = dto.rating;

    await this.movieRepository.save(movie);
    return movie;
  }
}
