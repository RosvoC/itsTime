import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from '../movie/movie.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ unique: true, nullable: true })
  idNumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true, nullable: true })
  verificationToken: string;

  @Column({ nullable: true, unique: true }) // null for users who haven't logged in yet
  token: string;

  @Column({ nullable: true, unique: true })
  resetToken: string;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany((_type) => Movie, (movie) => movie.user, { eager: true })
  movies: Movie[];
}
