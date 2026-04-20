export enum UserRole {
  FREE = 'FREE',
  SUBSCRIBER = 'SUBSCRIBER',
  COURSE_OWNER = 'COURSE_OWNER',
  ADMIN = 'ADMIN',
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
