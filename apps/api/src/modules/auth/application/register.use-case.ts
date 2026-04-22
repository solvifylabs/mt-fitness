import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../domain/user-repository.port';
import { IAuthPort, AUTH_PORT, TokenPair } from '../domain/auth.port';
import { RegisterDto } from '@mt-fitness/shared';

export interface RegisterResult extends TokenPair {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(AUTH_PORT) private readonly authPort: IAuthPort,
  ) {}

  async execute(dto: RegisterDto): Promise<RegisterResult> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.authPort.hashPassword(dto.password);
    const user = await this.userRepo.save({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });

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
