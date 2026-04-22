import { User } from './user.entity';

export interface CreateUserData {
  email: string;
  passwordHash: string | null;
  name: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(data: CreateUserData): Promise<User>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
