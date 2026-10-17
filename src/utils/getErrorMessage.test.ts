import { getErrorMessage } from './getErrorMessage';

test.each([
  [{ status: 400, data: { message: 'Invalid order' } }, 'Invalid order'],
  [{ status: 'FETCH_ERROR', error: 'Connection failed' }, 'Connection failed'],
  [new Error('Request failed'), 'Request failed'],
  [null, 'An unexpected error occurred.'],
])('formats API and network errors safely', (error, message) => {
  expect(getErrorMessage(error)).toBe(message);
});
