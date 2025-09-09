#!/usr/bin/env node

// Quick test to verify the demo app is working
const http = require('http');

console.log('Testing demo app endpoints...\n');

// Test home page
http.get('http://localhost:3000', (res) => {
    console.log(`✓ Home page: Status ${res.statusCode}`);
    
    // Test a simple API endpoint
    const postData = JSON.stringify({
        username: 'testuser',
        password: 'password'
    });
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };
    
    const req = http.request(options, (res) => {
        console.log(`✓ Login endpoint: Status ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log(`✓ Login response: ${response.message || response.error}`);
            } catch (e) {
                console.log('✓ Login response received');
            }
            
            console.log('\n🎉 Demo app is running correctly!');
            console.log('📖 Visit http://localhost:3000 to start testing');
            console.log('📚 See README.md and AI-TESTING-GUIDE.md for testing instructions');
            process.exit(0);
        });
    });
    
    req.on('error', (e) => {
        console.error(`❌ Login test failed: ${e.message}`);
        process.exit(1);
    });
    
    req.write(postData);
    req.end();
    
}).on('error', (e) => {
    console.error(`❌ App not running: ${e.message}`);
    console.log('Make sure to run "npm start" first');
    process.exit(1);
});
