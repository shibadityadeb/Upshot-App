export interface FriendlyError {
  title: string;
  message: string;
  kind: 'network' | 'server' | 'auth' | 'rate-limit' | 'unknown';
}

function extractMessage(error: unknown): string {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && 'message' in error) {
    const m = (error as { message?: unknown }).message;
    if (typeof m === 'string') return m;
  }
  return '';
}

function extractStatus(error: unknown): number | null {
  if (error && typeof error === 'object') {
    const status = (error as { status?: unknown }).status;
    if (typeof status === 'number') return status;
  }
  return null;
}

/**
 * Maps any raw error (Error, Supabase error object, string) to a
 * production-safe title + message. Raw technical messages are never
 * shown to the user.
 *
 * `context` optionally replaces the generic fallback message with an
 * action-specific one (e.g. "We couldn't load your wallet right now.").
 */
export function toFriendlyError(error?: unknown, context?: string): FriendlyError {
  const raw = extractMessage(error);
  const status = extractStatus(error);

  if (
    /network request failed|failed to fetch|networkerror|network error|timeout|timed out|aborted|socket|econnrefused|enotfound|offline|no internet|connection/i.test(
      raw
    )
  ) {
    return {
      kind: 'network',
      title: 'Connection Problem',
      message:
        'We could not reach our servers. Please check your internet connection and try again.',
    };
  }

  if (/too many requests|rate limit/i.test(raw) || status === 429) {
    return {
      kind: 'rate-limit',
      title: 'Slow Down a Moment',
      message: 'You are doing that a little too fast. Please wait a moment and try again.',
    };
  }

  if (/invalid login credentials/i.test(raw)) {
    return {
      kind: 'auth',
      title: 'Sign In Failed',
      message: 'The email or password you entered is incorrect. Please try again.',
    };
  }

  if (/email not confirmed/i.test(raw)) {
    return {
      kind: 'auth',
      title: 'Verify Your Email',
      message: 'Please confirm your email address using the link we sent you, then try again.',
    };
  }

  if (/jwt|session|token|not authenticated|unauthorized/i.test(raw) || status === 401) {
    return {
      kind: 'auth',
      title: 'Session Expired',
      message: 'Your session has expired. Please sign in again to continue.',
    };
  }

  if (
    (status !== null && status >= 500) ||
    /internal server|server error|service unavailable|bad gateway|gateway timeout|database|pgrst|postgres|constraint|violates|relation|column/i.test(
      raw
    )
  ) {
    return {
      kind: 'server',
      title: 'Server Issue',
      message:
        'Something broke on our end. Our team is already on it and we will have it fixed shortly. Please try again in a bit.',
    };
  }

  return {
    kind: 'unknown',
    title: 'Something Went Wrong',
    message:
      context ??
      'Something broke on our end. We are fixing it and will let you know. Please try again shortly.',
  };
}
