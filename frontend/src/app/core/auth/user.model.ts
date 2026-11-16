export type Role = 'USER' | 'ADMIN';

export interface UserResponseDto {
  publicId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  xpTotal: number;
  currentLevel: number;
  role: Role;
  createdAt: string;
}
