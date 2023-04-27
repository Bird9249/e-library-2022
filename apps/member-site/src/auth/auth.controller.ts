import {
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { AuthService } from './auth.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { RegisterDto } from './dto/registet.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.auth.register(body);
  }

  @Post('send-new-verify/:id')
  async sendNew(@Param('id', ParseIntPipe) id: number) {
    const user = await this.auth.sendNew(id);

    if (!user) {
      return 'ການສົ່ງອີເມວລົ້ມເຫລວ';
    }

    return user;
  }

  @Get('verify')
  async verifyEmail(@Query('id') id: string, @Query('token') token: string) {
    const user = await this.auth.verifyEmail(token, id);

    if (!user) {
      return 'ການຢັ້ງຢືນລົ້ມເຫລວ';
    }

    return 'ການຢັ້ງຢືນສຳເລັດແລ້ວ';
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.auth.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAuth(@Request() req) {
    return req.user;
  }

  @Post('forget-password')
  forgetPass(@Body() body: ForgetPasswordDto) {
    return this.auth.forgetPassword(body);
  }
}
