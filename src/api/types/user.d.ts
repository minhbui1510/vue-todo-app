// src/services/types/user.d.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}
