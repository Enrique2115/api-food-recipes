import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginInput } from './dto/auth.input';
import { CreateUserDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Get('logout')
  logout(@Param('user_id') user_id: string) {
    return this.authService.logout(user_id);
  }

  @Get('refresh_token')
  refreshToken(@Body() refreshToken: string) {
    return this.authService.refresh_token(refreshToken);
  }
}
