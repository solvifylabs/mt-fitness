import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

import { RegisterUseCase } from '../application/register.use-case';
import { LoginUseCase } from '../application/login.use-case';
import { PrismaUserRepository } from './prisma-user.repository';
import { JwtAdapter } from './jwt.adapter';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { USER_REPOSITORY } from '../domain/user-repository.port';
import { AUTH_PORT } from '../domain/auth.port';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'change-me-in-production'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: USER_REPOSITORY,
      useFactory: (prisma: PrismaClient) => new PrismaUserRepository(prisma),
      inject: [PrismaClient],
    },
    {
      provide: AUTH_PORT,
      useFactory: (jwtService: JwtService) => new JwtAdapter(jwtService),
      inject: [JwtService],
    },
  ],
  exports: [JwtAuthGuard, RolesGuard, AUTH_PORT],
})
export class AuthModule {}
