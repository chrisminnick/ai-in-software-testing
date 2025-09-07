const { calculate } = require('./calculator');

describe('Calculator', () => {
  test.each([
    ['add', 1, 2, 3],
    ['subtract', 5, 2, 3],
    ['multiply', 3, 3, 9],
  ])('%s %i and %i equals %i', (op, a, b, expected) => {
    expect(calculate(op, a, b)).toBe(expected);
  });

  test('throws error when dividing by zero', () => {
    expect(() => calculate('divide', 4, 0)).toThrow('Cannot divide by zero');
  });
});
