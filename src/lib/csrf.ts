import { cookies, headers } from 'next/headers';
import crypto from 'crypto';

/**
 * Generates a random 32-byte CSRF token in hex format.
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verifies that the X-CSRF-Token header matches the csrf_token cookie.
 * Throws an error if validation fails.
 */
export function verifyCsrf() {
  const headerList = headers();
  const csrfHeader = headerList.get('x-csrf-token');
  
  const cookieStore = cookies();
  const csrfCookie = cookieStore.get('csrf_token')?.value;

  if (!csrfHeader) {
    throw new Error('CSRF validation failed: Missing X-CSRF-Token header');
  }

  if (!csrfCookie) {
    throw new Error('CSRF validation failed: Missing csrf_token cookie');
  }

  if (csrfHeader !== csrfCookie) {
    throw new Error('CSRF validation failed: Token mismatch');
  }
}
