import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WatchStatus } from '../watch-status.enum';
import { Transform } from 'class-transformer';

export class GetMoviesFilterDto {
  @IsOptional()
  @IsEnum(WatchStatus)
  @Transform(({ obj }) => obj?.status || obj?.watchStatus)
  status?: WatchStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
