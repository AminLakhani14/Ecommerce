import { expect, test } from 'vitest';
import { formatUSD } from './currency';
test('USD prices format numeric and stored decimal totals consistently', () => {
  expect(formatUSD(1499).replace(/\s/g,' ')).toBe('USD 1,499.00');
  expect(formatUSD('24.5').replace(/\s/g,' ')).toBe('USD 24.50');
  expect(formatUSD(0).replace(/\s/g,' ')).toBe('USD 0.00');
});
