import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async signUp(@Body() AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.singUp(AuthCredentialsDto);
  }

  @Post('/signIn')
  @ApiOperation({ summary: 'Authenticate a user and return a JWT token' })
  @ApiResponse({ status: 201, description: 'User successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(
    @Body() AuthCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(AuthCredentialsDto);
  }
}
