import { validateEmail } from './validateEmail';

describe('validateEmail', () => {
  test('valid email with standard format', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('invalid email missing "@" symbol', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  test('invalid email with multiple "@" symbols', () => {
    expect(validateEmail('user@@example.com')).toBe(false);
  });

  test('valid email with subdomain', () => {
    expect(validateEmail('user@mail.example.co.uk')).toBe(true);
  });

  test('invalid email with invalid characters', () => {
    expect(validateEmail('user@exam!ple.com')).toBe(false);
  });

  test('missing "@" symbol', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  test('missing domain name', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  test('missing local part', () => {
    expect(validateEmail('@example.com')).toBe(false);
  });

  test('missing TLD (top-level domain)', () => {
    expect(validateEmail('user@example')).toBe(false);
  });

  test('multiple "@" symbols', () => {
    expect(validateEmail('user@@example.com')).toBe(false);
  });

  test('local part starts with a dot', () => {
    expect(validateEmail('.user@example.com')).toBe(false);
  });

  test('local part ends with a dot', () => {
    expect(validateEmail('user.@example.com')).toBe(false);
  });

  test('double dot in local part', () => {
    expect(validateEmail('user..name@example.com')).toBe(false);
  });

  test('special characters in domain', () => {
    expect(validateEmail('user@exa!mple.com')).toBe(false);
  });

  test('whitespace in email', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });

  test('email with newline character', () => {
    expect(validateEmail('user@example\n.com')).toBe(false);
  });

  test('email with emoji', () => {
    expect(validateEmail('user💩@example.com')).toBe(false);
  });

  test('non-string input: number', () => {
    expect(validateEmail(12345)).toBe(false);
  });

  test('non-string input: null', () => {
    expect(validateEmail(null)).toBe(false);
  });

  test('non-string input: undefined', () => {
    expect(validateEmail(undefined)).toBe(false);
  });

  test('empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});
