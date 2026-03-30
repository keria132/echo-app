export const PASSWORD_MIN_LENGTH = 8;
export const ERROR_MESSAGES = {
  emailExists: 'User with this email already exists',
  serverError: 'Internal server error',
  invalidUser: 'Invalid user data',
  signupError: 'Error in signup controller',
  jwtSecretFailure: 'Failed to configure jwt key',
};
export const JWT_EXPIRATION_TIME = '7d';
export const JWT_EXPIRATION_TIME_MS = 7 * 24 * 60 * 60 * 1000; //7 days
export const SALT_ROUNDS = parseInt(process.env.PASSWORD_SALT_ROUNDS || '10');
export const PROCESS_EXIT_CODE_FAILED = 1;
