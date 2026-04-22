import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IUserRepository, CreateUserData } from '../domain/user-repository.port';
import { User } from '../domain/user.entity';
import { UserRole } from '@mt-fitness/shared';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? this.toEntity(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async save(data: CreateUserData): Promise<User> {
    const row = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.passwordHash,
      },
    });
    return this.toEntity(row);
  }

  private toEntity(row: {
    id: string;
    email: string;
    password: string | null;
    name: string;
    role: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: row.id,
      email: row.email,
      passwordHash: row.password,
      name: row.name,
      role: row.role as UserRole,
      emailVerified: row.emailVerified,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
