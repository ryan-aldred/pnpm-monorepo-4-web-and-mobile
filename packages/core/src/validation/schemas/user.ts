import * as v from 'valibot';
import { EmailSchema, NameSchema, StrongPasswordSchema } from './auth';

export const CreateUserSchema = v.object({
  name: NameSchema,
  email: EmailSchema,
  password: StrongPasswordSchema,
});

export const UpdateUserSchema = v.object({
  name: v.optional(NameSchema),
  email: v.optional(EmailSchema),
});

export type CreateUserInput = v.InferInput<typeof CreateUserSchema>;
export type UpdateUserInput = v.InferInput<typeof UpdateUserSchema>;
