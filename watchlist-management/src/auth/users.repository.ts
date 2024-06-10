import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { AuthSignupDto } from './dto/auth.signup.dto';
import * as bcrypt from 'bcrypt';
import { ErrorCodes } from '../errorCodes';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async createUser(authSignupDto: AuthSignupDto): Promise<User> {
    const { name, surname, idNumber, email, password } = authSignupDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      name,
      surname,
      idNumber,
      email,
      password: hashedPassword,
    });
    try {
      return await this.save(user);
    } catch (error) {
      if (error.code === ErrorCodes.conflictError) {
        throw new ConflictException('ID Number or Email already taken');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  //looks for a user with a specific token
  async findByVerificationToken(
    verificationToken: string,
  ): Promise<User | undefined> {
    return this.findOne({ where: { verificationToken: verificationToken } });
  }
  async findByResetToken(resetToken: string): Promise<User | undefined> {
    return this.findOne({ where: { resetToken: resetToken } });
  }

  async updatePassword(user: User, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = null; // Clear the reset token after updating the password
    await this.save(user);
  }
}
