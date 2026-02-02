import * as v from 'valibot';
import { validate } from './errors';
import type { ValidationResult } from '../types';

export interface ApiValidationResult<T> extends ValidationResult<T> {
  response?: Response;
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function validateRequest<T>(
  schema: v.GenericSchema<unknown, T>,
  request: Request
): Promise<ApiValidationResult<T>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      errors: [{ field: '', message: 'Invalid JSON body' }],
      response: jsonResponse({ error: 'Invalid JSON body' }, 400),
    };
  }

  const result = validate(schema, body);

  if (!result.success) {
    return {
      ...result,
      response: jsonResponse(
        { error: 'Validation failed', errors: result.errors },
        400
      ),
    };
  }

  return result;
}
