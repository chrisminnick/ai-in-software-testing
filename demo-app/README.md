# Demo Registration & Login App

This is a **demonstration application** with intentional security vulnerabilities for educational purposes in AI-assisted software testing.

## ⚠️ SECURITY WARNING

**DO NOT USE IN PRODUCTION!** This application contains deliberately introduced vulnerabilities for testing practice.

## Purpose

This demo app is designed for functional testers to practice using AI chatbots to:
- Generate test inputs for fuzz testing
- Discover security vulnerabilities
- Practice systematic testing approaches
- Learn about common web application security issues

## Features

- User registration and login
- SQLite database backend
- Profile management
- User search functionality
- Admin panel
- Session management

## Intentional Vulnerabilities

The application includes various types of vulnerabilities that can be discovered through AI-assisted testing:

### 1. SQL Injection
- Login endpoint: Vulnerable to authentication bypass
- Search endpoint: Data extraction possible
- Profile update: Data manipulation possible

### 2. Input Validation Issues
- Weak password requirements (minimum 3 characters)
- Insufficient email validation
- Missing input sanitization

### 3. Authentication/Authorization Flaws
- Predictable admin credentials (admin/admin123)
- Information disclosure in error messages
- Weak session configuration
- No rate limiting on login attempts

### 4. Information Disclosure
- Exposes password hashes in admin endpoint
- Returns sensitive user data in API responses
- Different error messages reveal user existence

### 5. Cross-Site Scripting (XSS)
- Profile data not properly sanitized
- Stored XSS in user profiles
- Insecure cookie settings

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npm run setup-db
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

4. **Access the app:**
   Open http://localhost:3000 in your browser

## Test Credentials

- **Admin:** admin / admin123
- **User 1:** testuser / password  
- **User 2:** john_doe / user123

## Testing Ideas for AI Assistance

### 1. Fuzzing Registration Form
Ask AI to generate test cases for:
- Username field (special characters, SQL injection, XSS)
- Email field (invalid formats, extremely long inputs)
- Password field (edge cases, boundary testing)
- Profile data (JSON injection, malformed data)

### 2. Authentication Testing
- Brute force attack patterns
- SQL injection in login form
- Session manipulation attempts
- Authorization bypass techniques

### 3. API Endpoint Testing
- `/api/profile` - Parameter manipulation
- `/api/search` - SQL injection testing
- `/admin/users` - Authorization testing
- Profile update attacks

### 4. Input Validation Testing
Generate inputs that test:
- Maximum length boundaries
- Special character handling
- Unicode and encoding issues
- File upload simulation
- JSON parsing vulnerabilities

## Example AI Prompts for Testing

### For Input Generation:
> "Generate 20 test inputs for a username field that might reveal SQL injection vulnerabilities, including edge cases and boundary conditions."

### For Attack Vectors:
> "Create a list of potential XSS payloads to test in user profile data fields, including both stored and reflected XSS scenarios."

### For API Testing:
> "Generate curl commands to test a REST API endpoint for common security vulnerabilities including authorization bypass and data injection."

## Running Tests

```bash
npm test
```

The included test suite demonstrates various vulnerability testing approaches that can be expanded with AI assistance.

## Learning Objectives

Students using this app should learn to:
1. Identify common web application vulnerabilities
2. Use AI to generate comprehensive test inputs
3. Understand the importance of input validation
4. Practice systematic security testing
5. Recognize patterns in vulnerability discovery

## Extending the Testing

Consider having AI help generate:
- Automated fuzzing scripts
- Custom payload lists
- API testing sequences
- Performance testing scenarios
- Edge case identification

## Files Structure

```
demo-app/
├── server.js              # Main application server
├── setup-database.js      # Database initialization
├── package.json           # Dependencies and scripts
├── security.test.js       # Example security tests
├── public/
│   ├── index.html         # Login/registration page
│   └── dashboard.html     # User dashboard
└── users.db              # SQLite database (created after setup)
```

## Common Testing Scenarios

1. **Boundary Testing:** Very long usernames, emails, passwords
2. **Format Testing:** Invalid email formats, special characters
3. **Injection Testing:** SQL injection, XSS, JSON injection
4. **Authentication Testing:** Brute force, credential stuffing
5. **Authorization Testing:** Role escalation, access control bypass
6. **Session Testing:** Session fixation, timeout issues

Remember: The goal is to discover these vulnerabilities through systematic testing with AI assistance, not to exploit them maliciously.
