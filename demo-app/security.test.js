const request = require('supertest');
const app = require('../server');

describe('Demo App Security Tests', () => {
    describe('SQL Injection Tests', () => {
        test('Login endpoint should be vulnerable to SQL injection', async () => {
            const maliciousInput = "admin' OR '1'='1' --";
            
            const response = await request(app)
                .post('/login')
                .send({
                    username: maliciousInput,
                    password: 'anypassword'
                });
            
            // This test demonstrates the vulnerability
            expect(response.status).toBe(200); // Should fail in secure app
        });

        test('Search endpoint SQL injection', async () => {
            const maliciousQuery = "' UNION SELECT password, email FROM users --";
            
            const response = await request(app)
                .get('/api/search')
                .query({ q: maliciousQuery });
            
            // Check if injection attempt is successful
            expect(response.status).toBe(200);
        });
    });

    describe('Input Validation Tests', () => {
        test('Registration with empty fields', async () => {
            const response = await request(app)
                .post('/register')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Missing required fields');
        });

        test('Registration with weak password', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: '12' // Too weak
                });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Password too weak');
        });

        test('Registration with invalid email', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    email: 'notanemail',
                    password: 'password123'
                });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Invalid email format');
        });
    });

    describe('Authorization Tests', () => {
        test('Admin endpoint without authentication', async () => {
            const response = await request(app)
                .get('/admin/users');
            
            expect(response.status).toBe(403);
        });

        test('Profile endpoint without authentication', async () => {
            const response = await request(app)
                .get('/api/profile');
            
            expect(response.status).toBe(401);
        });
    });

    describe('XSS and Content Injection Tests', () => {
        test('Profile update with malicious content', async () => {
            // First login as a test user
            const loginResponse = await request(app)
                .post('/login')
                .send({
                    username: 'testuser',
                    password: 'password'
                });

            const cookies = loginResponse.headers['set-cookie'];

            const maliciousProfile = '<script>alert("XSS")</script>';
            
            const response = await request(app)
                .post('/api/profile')
                .set('Cookie', cookies)
                .send({
                    email: 'test@example.com',
                    profileData: maliciousProfile
                });
            
            // Check if malicious content is accepted
            expect(response.status).toBe(200);
        });
    });

    describe('Rate Limiting and Brute Force Tests', () => {
        test('Multiple failed login attempts', async () => {
            const attempts = [];
            for (let i = 0; i < 10; i++) {
                attempts.push(
                    request(app)
                        .post('/login')
                        .send({
                            username: 'admin',
                            password: 'wrongpassword'
                        })
                );
            }

            const responses = await Promise.all(attempts);
            
            // Check if there's any rate limiting
            responses.forEach(response => {
                expect(response.status).toBe(401); // Should eventually block
            });
        });
    });
});
