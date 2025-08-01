import { calculate } from './calculator';

// Test successful operations
test.each([
  ['add', 3, 2, 5],
  ['subtract', 5, 3, 2],
  ['multiply', 4, 3, 12],
  ['divide', 10, 2, 5],
])('calculate("%s", %i, %i) should return %i', (operation, a, b, expected) => {
  expect(calculate(operation, a, b)).toBe(expected);
});

// Test error cases
test.each([
  ['divide', 10, 0, 'Cannot divide by zero'],
  ['unknown', 5, 3, 'Unknown operation'],
])(
  'calculate("%s", %i, %i) should throw "%s"',
  (operation, a, b, expectedError) => {
    expect(() => calculate(operation, a, b)).toThrow(expectedError);
  }
);
