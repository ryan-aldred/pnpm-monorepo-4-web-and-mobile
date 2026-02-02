import * as v from 'valibot';

export const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('validation.email.required'),
  v.email('validation.email.invalid')
);

export const PasswordSchema = v.pipe(
  v.string(),
  v.nonEmpty('validation.password.required')
);

export const StrongPasswordSchema = v.pipe(
  v.string(),
  v.nonEmpty('validation.password.required'),
  v.minLength(8, 'validation.password.minLength'),
  v.regex(/[a-z]/, 'validation.password.lowercase'),
  v.regex(/[A-Z]/, 'validation.password.uppercase'),
  v.regex(/[0-9]/, 'validation.password.number')
);

export const NameSchema = v.pipe(
  v.string(),
  v.nonEmpty('validation.name.required'),
  v.minLength(2, 'validation.name.minLength')
);

export const LoginSchema = v.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const RegisterSchema = v.pipe(
  v.object({
    name: NameSchema,
    email: EmailSchema,
    password: StrongPasswordSchema,
    confirmPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'validation.password.mismatch'
    ),
    ['confirmPassword']
  )
);

export type LoginInput = v.InferInput<typeof LoginSchema>;
export type RegisterInput = v.InferInput<typeof RegisterSchema>;
