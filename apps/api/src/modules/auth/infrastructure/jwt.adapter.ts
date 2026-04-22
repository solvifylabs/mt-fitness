import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IAuthPort, TokenPair } from '../domain/auth.port';
import { JwtPayload } from '@mt-fitness/shared';

@Injectable()
export class JwtAdapter implements IAuthPort {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(payload: JwtPayload): TokenPair {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  verifyRefreshToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
