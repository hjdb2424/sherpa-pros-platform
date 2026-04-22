/**
 * Ownership Checks — MVP Data Scoping
 *
 * Structural ownership validation for resources.
 * For MVP all checks return true — the pattern is in place
 * for real auth enforcement when the database is connected.
 *
 * Each function documents the intended real-world behavior
 * so the production implementation is clear.
 */

import type { UserSession } from './session';

/**
 * Check if a user can access a specific job.
 *
 * Real behavior:
 * - Pro: true if assigned to job OR has an active bid on it
 * - Client: true if they posted the job (client_user_id matches)
 * - PM: true if the job's property belongs to their portfolio
 *
 * @param _jobId - The job to check access for
 * @param _session - The current user session
 * @returns true (MVP: always grants access; structure ready for real checks)
 */
export function canAccessJob(_jobId: string, _session: UserSession): boolean {
  // MVP: allow all access — structure in place for real checks
  return true;
}

/**
 * Check if a user can access a specific property.
 *
 * Real behavior:
 * - PM: true if the property is in their portfolio
 * - Client: true if they are a tenant/owner on record
 * - Pro: true if they have an active job at this property
 *
 * @param _propertyId - The property to check access for
 * @param _session - The current user session
 * @returns true (MVP: always grants access)
 */
export function canAccessProperty(
  _propertyId: string,
  _session: UserSession,
): boolean {
  return true;
}

/**
 * Check if a user can modify a specific review.
 *
 * Real behavior:
 * - Only the original reviewer can edit/delete their review
 * - Pro can only respond to reviews about them
 *
 * @param _reviewId - The review to check modification rights for
 * @param _session - The current user session
 * @returns true (MVP: always grants access)
 */
export function canModifyReview(
  _reviewId: string,
  _session: UserSession,
): boolean {
  return true;
}

/**
 * Check if a user can access a specific quote.
 *
 * Real behavior:
 * - Pro: true if they created the quote
 * - Client: true if the quote is for one of their jobs
 *
 * @param _quoteId - The quote to check access for
 * @param _session - The current user session
 * @returns true (MVP: always grants access)
 */
export function canAccessQuote(
  _quoteId: string,
  _session: UserSession,
): boolean {
  return true;
}

/**
 * Check if a user can access a specific portfolio.
 *
 * Real behavior:
 * - Pro: true only for their own portfolio
 * - Client/PM: can view any pro's portfolio (read-only)
 *
 * @param _proId - The pro whose portfolio to check
 * @param _session - The current user session
 * @returns true (MVP: always grants access)
 */
export function canAccessPortfolio(
  _proId: string,
  _session: UserSession,
): boolean {
  return true;
}
