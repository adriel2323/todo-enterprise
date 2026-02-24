import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Get('/users')
  @ApiOperation({ summary: 'Get all registered users' })
  @ApiResponse({
    status: 200,
    description: 'List of registered users',
    type: [AuthCredentialsDto],
  })
  getAllUsers(): Promise<AuthCredentialsDto[]> {
    return this.authService.getAllUsers();
  }
}
