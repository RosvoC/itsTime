import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Render,
  Request,
  Res,
} from '@nestjs/common';
import { AuthSignupDto } from './dto/auth.signup.dto';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { User } from './user.entity';
import { BlacklistService } from './blacklist.service';
import { Request as ExpressRequest, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private blacklistService: BlacklistService,
  ) {}

  @Post('/signup')
  signUp(@Body() authSignupDto: AuthSignupDto): Promise<void> {
    return this.authService.signUp(authSignupDto);
  }

  @Get('/verify')
  async verify(@Query('token') token: string): Promise<string> {
    const verified = await this.authService.verifiedEmail(token);
    if (verified) {
      return 'Email verified successfully. You can now proceed to login.';
    } else {
      throw new HttpException(
        'Unable to verify email. Please check your verification token.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/login')
  logIn(@Body() authLoginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    return this.authService.logIn(authLoginDto);
  }

  @Get('/user')
  //@UseGuards(AuthGuard('jwt'))
  getUser(@Request() req: ExpressRequest): Promise<User> {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.getUserByToken(token);
  }

  @Post('/logout')
  //@UseGuards(JwtAuthGuard)
  logout(@Request() req: ExpressRequest): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      this.blacklistService.addToBlacklist(token);
      return this.authService.logout(token);
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<void> {
    await this.authService.requestPasswordReset(email);
  }

  @Post('/reset-password')
  @Render('passwordResetSuccess')
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ): Promise<void> {
    if (!token || !password) {
      throw new BadRequestException('Token and password are required');
    }
    await this.authService.resetPassword(token, password);
  }
  @Get('/reset-password')
  @Render('passwordResetForm')
  async showResetPasswordPage(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<{ token: string; message: string }> {
    try {
      const message = 'Password successfully changed.';
      return { token, message }; // Pass the token and redirect URL to the template
    } catch (error) {
      // Handle error
      console.error('Error rendering template:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
