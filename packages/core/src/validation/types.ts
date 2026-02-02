export interface FieldError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: FieldError[];
}

export type FieldErrors = Record<string, string>;
