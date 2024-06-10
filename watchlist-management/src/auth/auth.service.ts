import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthSignupDto } from './dto/auth.signup.dto';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth.login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { User } from './user.entity';
import { BlacklistService } from './blacklist.service';
import { MailService } from './mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    private blacklistService: BlacklistService,
  ) {}

  async signUp(authSignupDto: AuthSignupDto): Promise<void> {
    const newUser = await this.usersRepository.createUser(authSignupDto);

    // Generate verification token and send email
    const signupToken = this.generateSignupToken(newUser);
    newUser.verificationToken = signupToken;
    await this.mailService.sendVerificationEmail(newUser, signupToken);
    // Save the new user to the database
    await this.usersRepository.save(newUser);
  }

  async verifiedEmail(token: string): Promise<boolean> {
    try {
      // Find the user by the verification token
      const user = await this.usersRepository.findByVerificationToken(token);
      if (user && !user.isVerified) {
        user.isVerified = true; // Mark the user as verified
        await this.usersRepository.save(user);
        return true; // Verification successful
      }
      return false; // Invalid token or user already verified
    } catch (error) {
      console.error('Error verifying email:', error);
      throw new HttpException(
        'Email verification failed. Please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async logIn(authLoginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    const { email, password } = authLoginDto;
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    if (!user.isVerified) {
      const verificationToken = this.generateSignupToken(user);
      await this.mailService.sendVerificationEmail(user, verificationToken);
      throw new UnauthorizedException('User is not verified');
    }

    const payload: JwtPayloadInterface = { email };
    const accessToken = this.jwtService.sign(payload);
    user.token = accessToken;
    await this.usersRepository.save(user);
    console.log(accessToken);
    return { accessToken };
  }

  async logout(token: string): Promise<void> {
    const user = await this.getUserByToken(token);

    if (user) {
      await this.usersRepository.save(user); // Update user in the database
      this.blacklistService.addToBlacklist(token); // Blacklist the token
    }
  }

  //Used to obtain user information associated with the token
  async getUserByToken(token: string): Promise<User> {
    const decodedToken: any = this.jwtService.verify(token);
    const { email } = decodedToken;
    return this.usersRepository.findOne({ where: { email: email } });
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resetToken = this.generateResetToken(user);
    user.resetToken = resetToken;
    await this.usersRepository.save(user);

    await this.mailService.sendPasswordResetEmail(user, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.usersRepository.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }
    await this.usersRepository.updatePassword(user, newPassword);
    user.resetToken = null; // Clear the reset token
    await this.usersRepository.save(user);
    return true;
  }

  private generateSignupToken(user: User): string {
    const payload: JwtPayloadInterface = { email: user.email };
    return this.jwtService.sign(payload, {
      expiresIn: 1200,
    });
  }

  private generateResetToken(user: User): string {
    const payload: JwtPayloadInterface = { email: user.email };
    return this.jwtService.sign(payload, {
      expiresIn: 1200,
    }); // expiration time 15m
  }
}
