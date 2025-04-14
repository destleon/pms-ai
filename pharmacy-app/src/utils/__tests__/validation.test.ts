import {
  isValidEmail,
  isValidPhone,
  validateRequired,
  validateNumber,
  validateDate,
  validateForm,
  isString,
  isNumber,
  isBoolean,
  safeApiCall
} from '../validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    test('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    test('should validate correct phone numbers', () => {
      expect(isValidPhone('+1234567890')).toBe(true);
      expect(isValidPhone('1234567890')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(isValidPhone('abc')).toBe(false);
      expect(isValidPhone('123')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    test('should validate required fields', () => {
      expect(validateRequired('value', 'field')).toBeNull();
      expect(validateRequired('', 'field')).toBe('field is required');
      expect(validateRequired(null, 'field')).toBe('field is required');
    });
  });

  describe('validateNumber', () => {
    test('should validate numeric values', () => {
      expect(validateNumber(123, 'field')).toBeNull();
      expect(validateNumber('abc', 'field')).toBe('field must be a number');
    });
  });

  describe('validateDate', () => {
    test('should validate date strings', () => {
      expect(validateDate('2023-12-31')).toBeNull();
      expect(validateDate('invalid-date')).toBe('Invalid date format');
    });
  });

  describe('validateForm', () => {
    test('should validate form fields', () => {
      const fields = {
        name: 'Test',
        email: '',
        phone: null
      };

      const errors = validateForm(fields);
      expect(errors).toHaveProperty('email');
      expect(errors).toHaveProperty('phone');
      expect(errors).not.toHaveProperty('name');
    });
  });

  describe('Type checking helpers', () => {
    test('should correctly identify types', () => {
      expect(isString('test')).toBe(true);
      expect(isString(123)).toBe(false);

      expect(isNumber(123)).toBe(true);
      expect(isNumber('123')).toBe(false);

      expect(isBoolean(true)).toBe(true);
      expect(isBoolean('true')).toBe(false);
    });
  });

  describe('safeApiCall', () => {
    test('should handle successful API calls', async () => {
      const mockApi = async () => 'success';
      const result = await safeApiCall(mockApi);
      expect(result.data).toBe('success');
      expect(result.error).toBeNull();
    });

    test('should handle API errors', async () => {
      const mockApi = async () => {
        throw new Error('API error');
      };
      const result = await safeApiCall(mockApi);
      expect(result.data).toBeNull();
      expect(result.error).toBe('API error');
    });
  });
});