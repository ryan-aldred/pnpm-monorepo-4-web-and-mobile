import * as v from 'valibot';
import type { FieldError, FieldErrors, ValidationResult } from '../types';

export function validate<T>(
  schema: v.GenericSchema<unknown, T>,
  data: unknown
): ValidationResult<T> {
  const result = v.safeParse(schema, data);

  if (result.success) {
    return {
      success: true,
      data: result.output,
    };
  }

  const errors: FieldError[] = result.issues.map((issue) => ({
    field: issue.path?.map((p) => p.key).join('.') || '',
    message: issue.message,
  }));

  return {
    success: false,
    errors,
  };
}

export function errorsToMap(errors: FieldError[]): FieldErrors {
  const map: FieldErrors = {};
  for (const error of errors) {
    if (error.field && !map[error.field]) {
      map[error.field] = error.message;
    }
  }
  return map;
}

export function getFieldError(
  errors: FieldErrors,
  field: string
): string | undefined {
  return errors[field];
}
