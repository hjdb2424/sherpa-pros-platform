/**
 * Email OTP — pure functions for code generation, hashing, and validation.
 *
 * Used by the email-OTP auth flow (spec: docs/superpowers/specs/2026-05-07-email-otp-auth-design.md).
 *
 * - Codes are 6-digit numeric strings padded with leading zeros (1M space).
 * - Hashes are SHA-256 hex digests, computed via Node's crypto module.
 * - All functions are pure — no DB access, no side effects.
 */

import { createHash, randomInt } from 'node:crypto';

/**
 * Generate a fresh 6-digit OTP, zero-padded so the value is always exactly 6
 * characters long. Uses `crypto.randomInt` for cryptographically uniform
 * distribution across [0, 1_000_000).
 */
export function generateCode(): string {
  const n = randomInt(0, 1_000_000);
  return n.toString().padStart(6, '0');
}

/**
 * Hash a 6-digit code with SHA-256 and return the lowercase hex digest.
 * Deterministic: the same input always produces the same output.
 */
export function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

/**
 * Constant-time-ish comparison of an input code against a stored hash.
 *
 * We hash the input and compare digests — this is intentional rather than
 * comparing plaintexts, since the database only stores the hash. Length
 * check first short-circuits malformed input.
 */
export function validateCode(input: string, storedHash: string): boolean {
  if (typeof input !== 'string' || typeof storedHash !== 'string') return false;
  if (input.length !== 6) return false;
  const inputHash = hashCode(input);
  if (inputHash.length !== storedHash.length) return false;
  // Plain string equality is fine here: both are deterministic SHA-256 hex
  // digests of fixed length, and the comparison happens after both inputs
  // have been hashed (no plaintext leak via timing).
  return inputHash === storedHash;
}
