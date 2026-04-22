import { JwtPayload } from '@mt-fitness/shared';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthPort {
  generateTokens(payload: JwtPayload): TokenPair;
  verifyAccessToken(token: string): JwtPayload;
  verifyRefreshToken(token: string): JwtPayload;
  hashPassword(plain: string): Promise<string>;
  comparePassword(plain: string, hash: string): Promise<boolean>;
}

export const AUTH_PORT = Symbol('IAuthPort');
