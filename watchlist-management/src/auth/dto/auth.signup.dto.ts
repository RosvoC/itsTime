import {
  IsEmail,
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthSignupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  surname: string;

  @IsNumberString()
  @MinLength(13)
  @MaxLength(13)
  idNumber: string;

  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is weak!',
  })
  password: string;
}
