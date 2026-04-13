// =============================================================================
// Wiseman Bridge — HTTP Client
// Calls BldSync Wiseman APIs for construction intelligence
// =============================================================================

import type {
  WisemanClientConfig,
  WisemanError,
  WisemanErrorCode,
  PricingValidationRequest,
  PricingValidationResult,
  BidValidationRequest,
  BidValidationResult,
  PermitCheckRequest,
  PermitCheckResult,
  ChecklistGenerationRequest,
  ChecklistResult,
  HealthCheckResponse,
} from './types';

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

function loadConfig(): WisemanClientConfig {
  const base_url = process.env.BLDSYNC_API_URL;
  if (!base_url) {
    throw new Error(
      'BLDSYNC_API_URL environment variable is required. ' +
      'Set it to the BldSync backend base URL (e.g., https://api.bldsync.com).'
    );
  }

  const api_key = process.env.BLDSYNC_API_KEY;
  if (!api_key) {
    throw new Error(
      'BLDSYNC_API_KEY environment variable is required. ' +
      'Set it to a valid BldSync API key.'
    );
  }

  return {
    base_url: base_url.replace(/\/+$/, ''),
    api_key,
    timeout_ms: parseInt(process.env.BLDSYNC_TIMEOUT_MS ?? '5000', 10),
    max_retries: parseInt(process.env.BLDSYNC_MAX_RETRIES ?? '3', 10),
    retry_base_delay_ms: parseInt(process.env.BLDSYNC_RETRY_BASE_DELAY_MS ?? '500', 10),
  };
}

// -----------------------------------------------------------------------------
// Error Mapping
// -----------------------------------------------------------------------------

function mapStatusToErrorCode(status: number): WisemanErrorCode {
  if (status === 401 || status === 403) return 'AUTH_FAILED';
  if (status === 404) return 'NOT_FOUND';
  if (status === 422 || status === 400) return 'VALIDATION_ERROR';
  if (status === 429) return 'RATE_LIMITED';
  if (status >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN';
}

function isRetryable(code: WisemanErrorCode): boolean {
  return code === 'NETWORK_ERROR' || code === 'TIMEOUT' || code === 'SERVER_ERROR' || code === 'RATE_LIMITED';
}

function createWisemanError(
  code: WisemanErrorCode,
  message: string,
  status_code: number | null,
  cause?: unknown
): WisemanError {
  return {
    code,
    message,
    status_code,
    retryable: isRetryable(code),
    cause,
  };
}

// -----------------------------------------------------------------------------
// Logger
// -----------------------------------------------------------------------------

function logRequest(method: string, url: string, body?: unknown): void {
  console.log(`[wiseman-bridge] ${method} ${url}`, body ? JSON.stringify(body).slice(0, 200) : '');
}

function logResponse(method: string, url: string, status: number, duration_ms: number): void {
  console.log(`[wiseman-bridge] ${method} ${url} -> ${status} (${duration_ms}ms)`);
}

function logRetry(attempt: number, max: number, delay_ms: number, reason: string): void {
  console.warn(`[wiseman-bridge] Retry ${attempt}/${max} in ${delay_ms}ms — ${reason}`);
}

function logError(method: string, url: string, error: WisemanError): void {
  console.error(`[wiseman-bridge] ${method} ${url} FAILED: [${error.code}] ${error.message}`);
}

// -----------------------------------------------------------------------------
// Core HTTP
// -----------------------------------------------------------------------------

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function makeRequest<T>(
  config: WisemanClientConfig,
  method: 'GET' | 'POST',
  path: string,
  body?: unknown
): Promise<T> {
  const url = `${config.base_url}${path}`;
  let lastError: WisemanError | null = null;

  for (let attempt = 0; attempt <= config.max_retries; attempt++) {
    if (attempt > 0) {
      const delay = config.retry_base_delay_ms * Math.pow(2, attempt - 1);
      logRetry(attempt, config.max_retries, delay, lastError?.message ?? 'unknown');
      await sleep(delay);
    }

    const start = Date.now();

    try {
      logRequest(method, url, body);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeout_ms);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.api_key}`,
          'X-Client': 'sherpa-pros-platform',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const duration = Date.now() - start;
      logResponse(method, url, response.status, duration);

      if (!response.ok) {
        const errorCode = mapStatusToErrorCode(response.status);
        let errorMessage: string;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message ?? errorBody.error ?? response.statusText;
        } catch {
          errorMessage = response.statusText;
        }

        lastError = createWisemanError(errorCode, errorMessage, response.status);

        if (!lastError.retryable) {
          logError(method, url, lastError);
          throw lastError;
        }

        continue;
      }

      const data = (await response.json()) as T;
      return data;
    } catch (err) {
      // If it is already a WisemanError that is non-retryable, re-throw
      if (
        err !== null &&
        typeof err === 'object' &&
        'code' in err &&
        'retryable' in err &&
        !(err as WisemanError).retryable
      ) {
        throw err;
      }

      const duration = Date.now() - start;

      if (err instanceof DOMException && err.name === 'AbortError') {
        lastError = createWisemanError('TIMEOUT', `Request timed out after ${config.timeout_ms}ms`, null, err);
        logResponse(method, url, 0, duration);
      } else if (
        err !== null &&
        typeof err === 'object' &&
        'code' in err &&
        'retryable' in err
      ) {
        lastError = err as WisemanError;
      } else {
        lastError = createWisemanError(
          'NETWORK_ERROR',
          err instanceof Error ? err.message : 'Network request failed',
          null,
          err
        );
      }

      if (attempt === config.max_retries) {
        logError(method, url, lastError);
        throw lastError;
      }
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError ?? createWisemanError('UNKNOWN', 'Unexpected error', null);
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export class WisemanClient {
  private config: WisemanClientConfig;

  constructor(config?: Partial<WisemanClientConfig>) {
    const defaults = loadConfig();
    this.config = { ...defaults, ...config };
  }

  /**
   * Validate whether a project budget is realistic for the given scope and location.
   * Calls BldSync Pricing Wiseman.
   */
  async validateBudget(request: PricingValidationRequest): Promise<PricingValidationResult> {
    return makeRequest<PricingValidationResult>(
      this.config,
      'POST',
      '/api/v1/wiseman/pricing/validate',
      request
    );
  }

  /**
   * Validate whether a bid amount is reasonable compared to market rates.
   * Calls BldSync Pricing Wiseman.
   */
  async validateBid(request: BidValidationRequest): Promise<BidValidationResult> {
    return makeRequest<BidValidationResult>(
      this.config,
      'POST',
      '/api/v1/wiseman/pricing/validate-bid',
      request
    );
  }

  /**
   * Check permit requirements for a job category in a specific jurisdiction.
   * Calls BldSync Code Wiseman.
   */
  async checkPermits(request: PermitCheckRequest): Promise<PermitCheckResult> {
    return makeRequest<PermitCheckResult>(
      this.config,
      'POST',
      '/api/v1/wiseman/code/permits',
      request
    );
  }

  /**
   * Generate a checklist for a given job type and category.
   * Calls BldSync Checklist Wiseman.
   */
  async generateChecklist(request: ChecklistGenerationRequest): Promise<ChecklistResult> {
    return makeRequest<ChecklistResult>(
      this.config,
      'POST',
      '/api/v1/wiseman/checklist/generate',
      request
    );
  }

  /**
   * Health check against the BldSync API.
   * Returns true if healthy, false otherwise.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await makeRequest<HealthCheckResponse>(
        this.config,
        'GET',
        '/api/v1/health'
      );
      return result.status === 'ok';
    } catch {
      return false;
    }
  }
}

// -----------------------------------------------------------------------------
// Singleton
// -----------------------------------------------------------------------------

let _instance: WisemanClient | null = null;

/**
 * Returns a singleton WisemanClient instance.
 * Safe to call from Server Components and Route Handlers.
 */
export function getWisemanClient(): WisemanClient {
  if (!_instance) {
    _instance = new WisemanClient();
  }
  return _instance;
}
