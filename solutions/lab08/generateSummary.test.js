import { generateSummary } from './generateSummary.js';

test('returns message for short input', () => {
  expect(generateSummary('Hi')).toBe('Input too short.');
});

test('returns summary string for long input', () => {
  const input = 'This is a long paragraph about testing AI output.';
  const output = generateSummary(input);
  expect(typeof output).toBe('string');
  expect(output.startsWith('Summary:')).toBe(true);
});

test('output is concise and prefixed', () => {
  const input =
    'Artificial intelligence in software testing improves coverage.';
  const summary = generateSummary(input);
  expect(summary).toMatch(/^Summary: .+/);
  expect(summary.length).toBeLessThan(100);
});
