import type { SignupSchemaType } from '@/schemas/auth.schema';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type SignupPayload = Omit<SignupSchemaType, 'repeatPassword'>;

export interface AuthUser {
  _id: string;
  name: string;
  handle: string;
  email: string;
  profileIcon?: string;
  createdAt: string;
  updatedAt: string;
}
