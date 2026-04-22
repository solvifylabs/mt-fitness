import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RegisterUseCase } from '../application/register.use-case';
import { LoginUseCase } from '../application/login.use-case';
import { RegisterDto, LoginDto } from '@mt-fitness/shared';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IAuthPort, AUTH_PORT } from '../domain/auth.port';
import { Inject } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    @Inject(AUTH_PORT) private readonly authPort: IAuthPort,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  refresh(@Request() req: { user: { sub: string; email: string; role: string } }) {
    const { sub, email, role } = req.user as any;
    const tokens = this.authPort.generateTokens({ sub, email, role });
    return tokens;
  }
}
