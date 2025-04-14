import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: false
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true
    },
    name: {
      required: true,
      mutable: true
    },
    phone_number: {
      required: false,
      mutable: true
    }
  },
  groups: ['admin', 'attendant'],
  multifactor: {
    mode: 'OPTIONAL',
    sms: true,
    totp: true
  },
  accountRecovery: 'EMAIL_ONLY',
  passwordStrength: {
    minLength: 12,
    requireNumbers: true,
    requireSpecialCharacters: true,
    requireLowercase: true,
    requireUppercase: true
  }
});




