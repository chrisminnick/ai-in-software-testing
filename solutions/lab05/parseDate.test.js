import { parseDate } from './parseDate.js';

test.each([
  ['valid ISO date', '2023-01-01', true],
  ['empty string', '', false],
  ['non-date string', 'Hello, world!', false],
  ['invalid day', '2022-02-30', false],
  ['non-leap year Feb 29', '2023-02-29', false],
  ['extreme future date', '9999-12-31', true],
])('%s: %s', (_, input, shouldPass) => {
  if (shouldPass) {
    expect(() => parseDate(input)).not.toThrow();
  } else {
    expect(() => parseDate(input)).toThrow('Invalid date');
  }
});
