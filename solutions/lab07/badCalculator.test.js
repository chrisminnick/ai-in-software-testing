import { calculate } from './calculator.js';
import { jest } from '@jest/globals';

describe('Calculator', () => {
  describe('Basic arithmetic operations', () => {
    test('should add two numbers correctly', () => {
      const result = calculate('add', 1, 2);
      expect(result).toBe(3);
    });

    test('should subtract two numbers correctly', () => {
      const result = calculate('subtract', 5, 2);
      expect(result).toBe(3);
    });

    test('should multiply two numbers correctly', () => {
      const result = calculate('multiply', 3, 3);
      expect(result).toBe(9);
    });
  });

  describe('Division operations', () => {
    test('should throw error when dividing by zero', () => {
      expect(() => calculate('divide', 4, 0)).toThrow('Cannot divide by zero');
    });

    test('should divide two numbers correctly', () => {
      const result = calculate('divide', 10, 2);
      expect(result).toBe(5);
    });
  });

  describe('Edge cases', () => {
    test('should handle unknown operations', () => {
      expect(() => calculate('unknown', 1, 2)).toThrow('Unknown operation');
    });
  });
});

describe('Jest spy functionality', () => {
  test('should track function calls correctly', () => {
    const spy = jest.fn();

    spy('hello');
    spy('world');

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('hello');
    expect(spy).toHaveBeenCalledWith('world');
  });
});
