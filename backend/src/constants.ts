export const PASSWORD_MIN_LENGTH = 8;
export const ERROR_MESSAGES = {
  emailExists: 'User with this email already exists',
  serverError: 'Internal server error',
  signupError: 'Error in signup controller',
  jwtSecretFailure: 'Failed to configure jwt key',
};
const JWT_EXPIRATION_DAYS = 7;
export const JWT_EXPIRATION_TIME = `${JWT_EXPIRATION_DAYS}d`;
export const JWT_EXPIRATION_TIME_MS = JWT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
export const SALT_ROUNDS = parseInt(process.env.PASSWORD_SALT_ROUNDS || '10');
export const PROCESS_EXIT_CODE_FAILED = 1;
