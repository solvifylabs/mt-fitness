import { ConflictException } from '@nestjs/common';
import { RegisterUseCase } from '../register.use-case';
import { IUserRepository } from '../../domain/user-repository.port';
import { IAuthPort } from '../../domain/auth.port';
import { User } from '../../domain/user.entity';
import { UserRole } from '@mt-fitness/shared';

const makeUser = (overrides: Partial<User> = {}): User =>
  new User({
    id: 'user-1',
    email: 'test@example.com',
    passwordHash: 'hashed',
    name: 'Test User',
    role: UserRole.FREE,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
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
    useCase = new RegisterUseCase(mockRepo, mockAuth);
  });

  it('should throw ConflictException if email already exists', async () => {
    mockRepo.findByEmail.mockResolvedValue(makeUser());

    await expect(
      useCase.execute({ name: 'Test', email: 'test@example.com', password: 'pass123' }),
    ).rejects.toThrow(ConflictException);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('should hash the password and save the user', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockAuth.hashPassword.mockResolvedValue('hashed_pw');
    const saved = makeUser({ passwordHash: 'hashed_pw' });
    mockRepo.save.mockResolvedValue(saved);
    mockAuth.generateTokens.mockReturnValue({
      accessToken: 'at',
      refreshToken: 'rt',
    });

    await useCase.execute({ name: 'Test', email: 'test@example.com', password: 'plain' });

    expect(mockAuth.hashPassword).toHaveBeenCalledWith('plain');
    expect(mockRepo.save).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test',
      passwordHash: 'hashed_pw',
    });
  });

  it('should return tokens and user without password', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockAuth.hashPassword.mockResolvedValue('hashed_pw');
    const saved = makeUser();
    mockRepo.save.mockResolvedValue(saved);
    mockAuth.generateTokens.mockReturnValue({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const result = await useCase.execute({
      name: 'Test',
      email: 'test@example.com',
      password: 'plain',
    });

    expect(result.accessToken).toBe('access_token');
    expect(result.refreshToken).toBe('refresh_token');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.user.email).toBe('test@example.com');
  });
});
