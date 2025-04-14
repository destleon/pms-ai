import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true
    }
  },
  groups: ['admin', 'attendant'],
  // Removed passwordPolicy as it is not a valid property
  multifactor: {
    mode: 'OFF'
  },
  accountRecovery: 'EMAIL_ONLY'
});



