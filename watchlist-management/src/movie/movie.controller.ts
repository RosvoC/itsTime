import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDetailsDto } from './dto/update-movie-details.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { GetMoviesFilterDto } from './dto/get-movies-filter-dto';

@Controller('/movies')
@UseGuards(AuthGuard())
export class MovieController {
  constructor(private movieService: MovieService) {}
  @Get('/:id')
  getMovieById(@Param('id') id: string, @GetUser() user: User): Promise<Movie> {
    return this.movieService.getMovieById(id, user);
  }

  @Get()
  getMovies(
    @Query() filterDto: GetMoviesFilterDto,
    @GetUser() user: User,
  ): Promise<Movie[]> {
    return this.movieService.getMovies(filterDto, user);
  }
  @Post('/new')
  createMovie(
    @Body() createTaskDto: CreateMovieDto,
    @GetUser() user: User,
  ): Promise<Movie> {
    return this.movieService.createMovie(createTaskDto, user);
  }
  @Delete('/:id')
  deleteMovie(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.movieService.deleteMovie(id, user);
  }
  @Patch('/:id/status')
  updateMovieStatus(
    @Param('id') id: string,
    @Body() updateMovieDetailsDto: UpdateMovieDetailsDto,
    @GetUser() user: User,
  ): Promise<Movie> {
    return this.movieService.updateMovieDetails(
      id,
      updateMovieDetailsDto,
      user,
    );
  }
}
