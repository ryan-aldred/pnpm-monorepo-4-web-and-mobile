import type { FieldErrors } from '../types';

type TranslateFn = (key: string) => string;

export function translateErrors(
  errors: FieldErrors,
  translate: TranslateFn
): FieldErrors {
  const translated: FieldErrors = {};
  for (const [field, message] of Object.entries(errors)) {
    translated[field] = translate(message);
  }
  return translated;
}

export function translateError(
  error: string | undefined,
  translate: TranslateFn
): string | undefined {
  if (!error) return undefined;
  return translate(error);
}
