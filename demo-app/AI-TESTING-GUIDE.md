# AI-Assisted Testing Guide

This guide provides practical examples of how to use AI chatbots to generate test inputs and discover vulnerabilities in the demo application.

## Getting Started

1. **Set up the demo app** (see main README.md)
2. **Choose an AI assistant** (ChatGPT, Claude, Copilot, etc.)
3. **Follow the structured testing approach below**

## Phase 1: Understanding the Application

### Initial AI Prompt:
```
I'm testing a web application with the following endpoints:
- POST /register (username, email, password, confirmPassword, profileData)
- POST /login (username, password)
- GET /api/profile
- POST /api/profile (email, profileData)
- GET /api/search?q=searchterm
- GET /admin/users

The app uses SQLite database and has intentional vulnerabilities for educational testing. 
What systematic approach should I take to test these endpoints for security issues?
```

## Phase 2: Input Generation for Registration

### AI Prompt for Username Testing:
```
Generate 15 different test inputs for a username field that might reveal vulnerabilities including:
- SQL injection attempts
- XSS payloads
- Buffer overflow tests
- Special characters
- Unicode edge cases
- Boundary conditions

Format as a JSON array with input and expected_behavior fields.
```

### Expected AI Response Pattern:
```json
[
  {"input": "admin' OR '1'='1' --", "expected_behavior": "SQL injection test"},
  {"input": "<script>alert('xss')</script>", "expected_behavior": "XSS payload"},
  {"input": "A".repeat(1000), "expected_behavior": "Long input test"},
  {"input": "test\u0000user", "expected_behavior": "Null byte injection"},
  {"input": "user'; DROP TABLE users; --", "expected_behavior": "SQL injection"},
  // ... more test cases
]
```

## Phase 3: Email Field Fuzzing

### AI Prompt:
```
Create 20 test cases for an email field that might bypass validation or cause unexpected behavior:
- Invalid email formats
- Extremely long emails
- Special characters in local/domain parts
- International domain names
- Edge cases that might confuse parsers

Include both malicious and edge case inputs.
```

## Phase 4: Password Testing

### AI Prompt:
```
Generate test cases for password fields focusing on:
- Boundary testing (very short/long passwords)
- Special character combinations
- Unicode characters
- SQL injection in password fields
- Common password attack patterns

Also suggest how to test password confirmation logic.
```

## Phase 5: JSON Profile Data Testing

### AI Prompt:
```
The profile data field accepts JSON. Generate test payloads that might:
- Cause JSON parsing errors
- Include malicious JavaScript
- Test for injection vulnerabilities
- Include extremely nested objects
- Test Unicode and encoding issues
- Include null bytes or control characters

Provide 10 different malicious JSON payloads and 5 malformed structure tests.
```

## Phase 6: SQL Injection Testing

### AI Prompt for Login:
```
Generate SQL injection payloads specifically for testing login forms where the query might be:
SELECT * FROM users WHERE username = 'INPUT' AND password = 'INPUT'

Include:
- Authentication bypass attempts
- Union-based injections
- Time-based blind injections
- Error-based injections
- Comment-based bypasses

Format as curl commands I can run against http://localhost:3000/login
```

### AI Prompt for Search Function:
```
Create SQL injection payloads for a search endpoint that likely uses:
SELECT username, email FROM users WHERE username LIKE '%INPUT%'

Focus on:
- Data extraction attempts
- Union injections to get password hashes
- Boolean-based blind injection
- Information schema queries

Format as URLs I can test: http://localhost:3000/api/search?q=PAYLOAD
```

## Phase 7: Authentication Bypass Testing

### AI Prompt:
```
Help me test authentication bypass on these endpoints:
- /api/profile (should require login)
- /admin/users (should require admin role)

Generate test scenarios for:
- Session manipulation
- Cookie tampering
- Header injection
- Role escalation attempts
- Direct object reference

Include curl commands and JavaScript fetch examples.
```

## Phase 8: XSS Testing

### AI Prompt:
```
Generate XSS payloads for testing in user profile data that might:
- Execute in the dashboard when displayed
- Bypass basic filters (like script tag removal)
- Use event handlers
- Include encoded payloads
- Test stored XSS scenarios

Provide 15 different XSS vectors with varying complexity.
```

## Phase 9: API Security Testing

### AI Prompt:
```
Create a comprehensive test plan for the REST API endpoints including:
- HTTP method tampering (PUT, DELETE on endpoints that expect POST)
- Content-Type manipulation
- Parameter pollution
- HTTP header injection
- JSON structure attacks
- Rate limiting tests

Generate both manual curl commands and suggestions for automated testing.
```

## Phase 10: Automated Test Generation

### AI Prompt:
```
Write a Python script using requests library that:
- Tests all the vulnerabilities we've identified
- Includes the payloads we generated
- Logs results systematically
- Checks for vulnerability indicators in responses
- Handles sessions and cookies properly

Structure it as a proper security testing framework.
```

## Sample AI-Generated Test Script Template

Ask AI to create something like this:

```python
import requests
import json
import time

class VulnerabilityTester:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.session = requests.Session()
        
    def test_sql_injection_login(self):
        payloads = [
            # AI generates list here
        ]
        # AI generates test logic
        
    def test_xss_profile(self):
        # AI generates XSS testing logic
        
    def test_authentication_bypass(self):
        # AI generates auth bypass tests
```

## Advanced AI Prompting Techniques

### 1. Chain of Thought Prompting:
```
Let's think step by step about testing this login form:
1. First, what normal inputs should work?
2. What edge cases might break validation?
3. What malicious inputs might bypass authentication?
4. How can we systematically test each vulnerability type?

Walk me through your reasoning for each test case.
```

### 2. Role-Based Prompting:
```
Act as a penetration tester with 10 years of experience. 
You're testing a web application for SQL injection vulnerabilities.
The application uses SQLite and has string concatenation in queries.
What would be your systematic approach and what payloads would you try first?
```

### 3. Constraint-Based Prompting:
```
Generate SQL injection payloads that:
- Work specifically with SQLite (not MySQL/PostgreSQL)
- Avoid causing application crashes
- Focus on data extraction rather than destruction
- Account for potential basic filtering
- Stay under 100 characters each
```

## Measuring Success

Track your AI-assisted testing with:

### Vulnerability Discovery Rate:
- How many vulnerabilities found per hour?
- Coverage of different vulnerability types
- False positive rate

### AI Prompt Effectiveness:
- Which prompts generated the most useful test cases?
- Time saved compared to manual test generation
- Quality of AI-suggested test approaches

### Learning Outcomes:
- Understanding of vulnerability patterns
- Improvement in test case quality
- Better systematic testing approach

## Common AI Limitations to Watch For

1. **Hallucinated Payloads:** AI might suggest payloads that don't actually work
2. **Context Loss:** Long conversations may lose important context
3. **Over-Complexity:** AI might suggest overly complex attacks when simple ones work
4. **False Assumptions:** AI might assume certain technologies or configurations

## Best Practices

1. **Validate AI Suggestions:** Always test the AI-generated payloads
2. **Iterate and Refine:** Use results to improve your prompts
3. **Combine Manual and AI:** Use AI for generation, human insight for strategy
4. **Document Everything:** Keep track of successful prompts and approaches
5. **Stay Ethical:** Only test on applications you own or have permission to test

## Practice Exercises

1. **Prompt Engineering:** Try to get AI to generate a payload that successfully bypasses the login
2. **Test Case Optimization:** Have AI help you reduce 100 test cases to the 10 most effective
3. **Automation Creation:** Get AI to write a complete testing script for one vulnerability type
4. **Report Generation:** Have AI help format your findings into a professional vulnerability report

Remember: The goal is to learn both about security testing AND how to effectively use AI as a testing assistant!
