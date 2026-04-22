import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../domain/user-repository.port';
import { IAuthPort, AUTH_PORT, TokenPair } from '../domain/auth.port';
import { LoginDto } from '@mt-fitness/shared';

export interface LoginResult extends TokenPair {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(AUTH_PORT) private readonly authPort: IAuthPort,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await this.authPort.comparePassword(
      dto.password,
      user.passwordHash ?? '',
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.authPort.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
