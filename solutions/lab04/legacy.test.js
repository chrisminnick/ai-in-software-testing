import { mysteryFunc } from './legacy.js';

describe('mysteryFunc', () => {
  describe('basic functionality', () => {
    test('should alternate case starting with uppercase for even indices', () => {
      expect(mysteryFunc('hello')).toBe('HeLlO');
    });

    test('should handle single character', () => {
      expect(mysteryFunc('a')).toBe('A');
    });

    test('should handle two characters', () => {
      expect(mysteryFunc('ab')).toBe('Ab');
    });

    test('should handle mixed case input', () => {
      expect(mysteryFunc('HeLLo')).toBe('HeLlO');
    });
  });

  describe('edge cases', () => {
    test('should handle empty string', () => {
      expect(mysteryFunc('')).toBe('');
    });

    test('should handle string with spaces', () => {
      expect(mysteryFunc('hello world')).toBe('HeLlO WoRlD');
    });

    test('should handle string with numbers', () => {
      expect(mysteryFunc('abc123')).toBe('AbC123');
    });

    test('should handle string with special characters', () => {
      expect(mysteryFunc('hello!')).toBe('HeLlO!');
    });

    test('should handle string with punctuation', () => {
      expect(mysteryFunc('hello, world!')).toBe('HeLlO, wOrLd!');
    });
  });

  describe('longer strings', () => {
    test('should handle longer string correctly', () => {
      expect(mysteryFunc('javascript')).toBe('JaVaScRiPt');
    });

    test('should handle very long string', () => {
      const input = 'thisisaverylongstringfortesting';
      const expected = 'ThIsIsAvErYlOnGsTrInGfOrTeStInG';
      expect(mysteryFunc(input)).toBe(expected);
    });
  });

  describe('special character handling', () => {
    test('should handle accented characters', () => {
      expect(mysteryFunc('café')).toBe('CaFé');
    });

    test('should handle unicode characters', () => {
      expect(mysteryFunc('hello👋')).toBe('HeLlO👋');
    });

    test('should handle newlines and tabs', () => {
      expect(mysteryFunc('a\nb\tc')).toBe('A\nB\tC');
    });
  });

  describe('already transformed strings', () => {
    test('should handle already correctly formatted string', () => {
      expect(mysteryFunc('HeLlO')).toBe('HeLlO');
    });

    test('should handle reverse pattern (lowercase first)', () => {
      expect(mysteryFunc('hElLo')).toBe('HeLlO');
    });
  });

  describe('all uppercase input', () => {
    test('should handle all uppercase string', () => {
      expect(mysteryFunc('HELLO')).toBe('HeLlO');
    });

    test('should handle all uppercase with spaces', () => {
      expect(mysteryFunc('HELLO WORLD')).toBe('HeLlO WoRlD');
    });
  });

  describe('all lowercase input', () => {
    test('should handle all lowercase string', () => {
      expect(mysteryFunc('hello')).toBe('HeLlO');
    });

    test('should handle all lowercase with spaces', () => {
      expect(mysteryFunc('hello world')).toBe('HeLlO WoRlD');
    });
  });

  describe('numeric and alphanumeric strings', () => {
    test('should handle numeric string (numbers remain unchanged)', () => {
      expect(mysteryFunc('12345')).toBe('12345');
    });

    test('should handle alphanumeric string', () => {
      expect(mysteryFunc('test123')).toBe('TeSt123');
    });

    test('should handle string starting with numbers', () => {
      expect(mysteryFunc('123abc')).toBe('123aBc');
    });
  });

  describe('whitespace handling', () => {
    test('should handle leading and trailing spaces', () => {
      expect(mysteryFunc(' hello ')).toBe(' hElLo ');
    });

    test('should handle multiple spaces', () => {
      expect(mysteryFunc('a  b  c')).toBe('A  b  C');
    });

    test('should handle only spaces', () => {
      expect(mysteryFunc('   ')).toBe('   ');
    });
  });

  describe('regression tests for consistent behavior', () => {
    // These tests capture the current behavior to prevent regressions
    const testCases = [
      { input: 'test', expected: 'TeSt' },
      { input: 'JavaScript', expected: 'JaVaScRiPt' },
      { input: 'Hello, World!', expected: 'HeLlO, wOrLd!' },
      { input: 'a1b2c3', expected: 'A1B2C3' },
      { input: 'UPPERCASE', expected: 'UpPeRcAsE' },
      { input: 'lowercase', expected: 'LoWeRcAsE' },
      { input: '!@#$%^&*()', expected: '!@#$%^&*()' },
      { input: 'one two three', expected: 'OnE TwO ThReE' },
      { input: 'CamelCase', expected: 'CaMeLcAsE' },
      { input: 'snake_case', expected: 'SnAkE_CaSe' },
    ];

    testCases.forEach(({ input, expected }) => {
      test(`should consistently transform "${input}" to "${expected}"`, () => {
        expect(mysteryFunc(input)).toBe(expected);
      });
    });
  });

  describe('type safety and error handling', () => {
    test('should handle string with only uppercase letters', () => {
      expect(mysteryFunc('ABC')).toBe('AbC');
    });

    test('should handle string with only lowercase letters', () => {
      expect(mysteryFunc('abc')).toBe('AbC');
    });

    test('should be idempotent when applied twice to certain patterns', () => {
      const input = 'HeLlO';
      const firstTransform = mysteryFunc(input);
      const secondTransform = mysteryFunc(firstTransform);
      expect(firstTransform).toBe('HeLlO');
      expect(secondTransform).toBe('HeLlO');
    });
  });
});
