import { UserRole } from '@mt-fitness/shared';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string | null;
  readonly name: string;
  readonly role: UserRole;
  readonly emailVerified: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.name = props.name;
    this.role = props.role;
    this.emailVerified = props.emailVerified;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  toPublic(): Omit<UserProps, 'passwordHash'> {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
