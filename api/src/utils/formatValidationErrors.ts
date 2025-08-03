import { Result, ValidationError } from 'express-validator';

type StandardValidationError = {
  param: string;
  message: string;
};

export function formatValidationErrors(result: Result<ValidationError>) {
  const formatted: Record<string, string> = {};

  result.array().forEach((error) => {
    if ('param' in error && 'message' in error) {
      const e = error as StandardValidationError;
      if (!formatted[e.param]) {
        formatted[e.param] = e.message;
      }
    }
  });

  return formatted;
}
