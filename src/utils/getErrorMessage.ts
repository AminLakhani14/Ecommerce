export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    if ('data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data && typeof error.data.message === 'string') return error.data.message;
    if ('error' in error && typeof error.error === 'string') return error.error;
    if ('message' in error && typeof error.message === 'string') return error.message;
  }
  return 'An unexpected error occurred.';
}
