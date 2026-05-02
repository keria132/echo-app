export const PASSWORD_MIN_LENGTH = 8;
export const ERROR_MESSAGES = {
  emailExists: 'User with this email already exists',
  serverError: 'Internal server error',
  signupError: 'Error in signup controller',
  invalidLogin: 'Invalid credentials',
  unauthorized: 'Unauthorized access',
  invalidToken: 'Invalid token',
  userNotFound: 'User is not found',
  profileIcon: 'Profile picture required!',
  tokenExpired: 'Token is expired!',
  tooManyRequests: 'Too many requests!',
  botDenied: 'Bot access denied!',
  securityDenied: 'Access denied by security policy',
  spoofDenied: 'Spoofed bot detected',
  loggedUserIdUndefined: 'Logged in user id is undefined!',
  blankMessage: 'Cannot send blank message, text or image is required',
  messageReceiverNotFound: 'User receiver is not found',
  selfMessage: 'Cannot send a message to yourself',
};
const JWT_EXPIRATION_DAYS = 7;
export const JWT_EXPIRATION_TIME = `${JWT_EXPIRATION_DAYS}d`;
export const JWT_EXPIRATION_TIME_MS = JWT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
export const SALT_ROUNDS = parseInt(process.env.PASSWORD_SALT_ROUNDS || '10');
export const PROCESS_EXIT_CODE_FAILED = 1;
export const DEFAULT_PORT = 3000;
export const AUTH_COOKIE_NAME = 'echo.token';
export const EXPRESS_JSON_LIMIT = '5mb';
export const USER_PRIVATE_FIELDS = '-password -email';
