import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../login.use-case';
import { IUserRepository } from '../../domain/user-repository.port';
import { IAuthPort } from '../../domain/auth.port';
import { User } from '../../domain/user.entity';
import { UserRole } from '@mt-fitness/shared';

const makeUser = (overrides: Partial<User> = {}): User =>
  new User({
    id: 'user-1',
    email: 'test@example.com',
    passwordHash: 'hashed_pw',
    name: 'Test User',
    role: UserRole.FREE,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;
  let mockAuth: jest.Mocked<IAuthPort>;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    mockAuth = {
      generateTokens: jest.fn(),
      verifyAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };
    useCase = new LoginUseCase(mockRepo, mockAuth);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'nobody@example.com', password: 'pass' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    mockRepo.findByEmail.mockResolvedValue(makeUser());
    mockAuth.comparePassword.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
    expect(mockAuth.generateTokens).not.toHaveBeenCalled();
  });

  it('should return JWT tokens on successful login', async () => {
    mockRepo.findByEmail.mockResolvedValue(makeUser());
    mockAuth.comparePassword.mockResolvedValue(true);
    mockAuth.generateTokens.mockReturnValue({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'correct',
    });

    expect(result.accessToken).toBe('access_token');
    expect(result.refreshToken).toBe('refresh_token');
    expect(result.user.email).toBe('test@example.com');
    expect(result.user).not.toHaveProperty('passwordHash');
  });
});
