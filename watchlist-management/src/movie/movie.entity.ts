import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WatchStatus } from './watch-status.enum';
import { MovieGenre } from './movie-genre.enum';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column()
  releaseYear: string;

  @Column()
  genre: MovieGenre;

  @Column({ nullable: true })
  rating: number;

  @Column()
  description: string;

  @Column()
  status: WatchStatus;

  @Column()
  imagePath: string;

  @ManyToOne((type) => User, (user) => user.movies, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
