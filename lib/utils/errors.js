/**
 * Error handling utilities
 * Custom error classes and centralized error handler
 */

export class IpaCkError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'IpaCkError';
    this.code = code;
  }
}

export const ErrorCodes = {
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  ALREADY_INITIALIZED: 'ALREADY_INITIALIZED',
  VERSION_NOT_FOUND: 'VERSION_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
};

/**
 * Handle errors with user-friendly messages
 * @param {Error} error - Error to handle
 */
export function handleError(error) {
  if (error.code === 'EACCES') {
    console.error('Permission denied. Try running with sudo or check file permissions.');
    process.exit(1);
  }

  if (error.code === 'ENOENT') {
    console.error(`File not found: ${error.path}`);
    process.exit(1);
  }

  if (error instanceof IpaCkError) {
    console.error(error.message);
    process.exit(1);
  }

  // Unknown error - show stack trace in debug mode
  console.error('Unexpected error:', error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
}
