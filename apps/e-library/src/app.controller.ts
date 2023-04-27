import {
  Controller,
  Get,
  UseGuards,
  Post,
  Request,
  Param,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';
import { Body } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return await this.authService.forgotPassword(body.email);
  }

  @Post('auth/reset-password/:id')
  async resetPassword(
    @Body() body: { password: string },
    @Param('id', ParseIntPipe) id: number,
    @Query() query: { token: string },
  ) {
    return await this.authService.resetPassword(id, query.token, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAuth(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }
}
