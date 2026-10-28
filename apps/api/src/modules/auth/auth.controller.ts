import { Controller, Post, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('demo')
  async loginDemo() {
    return this.authService.loginDemoUser();
  }

  @Get('me')
  async getProfile(@Headers('authorization') authHeader?: string) {
    if (!authHeader) {
      return this.authService.loginDemoUser();
    }
    const token = authHeader.replace('Bearer ', '');
    return this.authService.validateToken(token);
  }
}
