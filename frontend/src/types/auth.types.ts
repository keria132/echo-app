import type { SignupSchemaType } from '@/schemas/auth.schema';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type SignupPayload = Omit<SignupSchemaType, 'repeatPassword'>;
