// Basic validation utilities for the pharmacy app

// Email validation
export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

// Phone number validation
export function isValidPhone(phone: string): boolean {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
}

// Error handling wrapper
export async function safeApiCall<T>(
  apiFunction: () => Promise<T>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const result = await apiFunction();
    return { data: result, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { data: null, error: errorMessage };
  }
}

// Field validation
export function validateRequired(value: any, fieldName: string): string | null {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  return null;
}

// Numeric validation
export function validateNumber(value: any, fieldName: string): string | null {
  if (isNaN(value)) {
    return `${fieldName} must be a number`;
  }
  return null;
}

// Date validation
export function validateDate(value: string): string | null {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }
  return null;
}

// Form validation helper
export function validateForm(fields: { [key: string]: any }): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  Object.entries(fields).forEach(([key, value]) => {
    const error = validateRequired(value, key);
    if (error) {
      errors[key] = error;
    }
  });

  return errors;
}

// Type checking helpers
export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

// Error handling types
export type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// API response wrapper
export function createApiResponse<T>(data?: T, error?: string): ApiResult<T> {
  if (error) {
    return {
      success: false,
      error
    };
  }
  return {
    success: true,
    data
  };
}