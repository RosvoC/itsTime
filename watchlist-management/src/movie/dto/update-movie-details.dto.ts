import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { WatchStatus } from '../watch-status.enum';
import { Transform } from 'class-transformer';

export class UpdateMovieDetailsDto {
  @IsEnum(WatchStatus)
  @Transform(({ obj }) => obj?.status || obj?.watchStatus)
  status: WatchStatus;

  @IsNumber()
  @IsOptional()
  rating: number;
}
