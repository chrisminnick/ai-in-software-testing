const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'users.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Session configuration with vulnerabilities
app.use(
  session({
    secret: 'demo-secret-key', // Intentionally weak secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Should be true in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours - too long
      httpOnly: false, // Vulnerability: allows XSS access to cookies
    },
  })
);

// Database connection
const db = new sqlite3.Database(dbPath);

// Utility functions
function isValidEmail(email) {
  // Intentionally weak email validation
  return email && email.includes('@');
}

function isStrongPassword(password) {
  // Intentionally weak password validation
  return password && password.length >= 3; // Way too weak
}

function sanitizeInput(input) {
  // Intentionally incomplete sanitization
  if (!input) return '';
  return input.replace(/script/gi, ''); // Only removes 'script' tags, not comprehensive
}

// Routes

// Home page
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Registration endpoint with vulnerabilities
app.post('/register', (req, res) => {
  const { username, email, password, confirmPassword, profileData } = req.body;

  // Vulnerability: Insufficient input validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Vulnerability: Password confirmation not properly checked
  if (password !== confirmPassword && confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Vulnerability: Weak validation functions
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({ error: 'Password too weak' });
  }

  // Vulnerability: SQL injection possible through improper string concatenation
  const checkUserQuery = `SELECT * FROM users WHERE username = '${username}' OR email = '${email}'`;

  db.all(checkUserQuery, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (rows.length > 0) {
      return res
        .status(409)
        .json({ error: 'Username or email already exists' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: 'Password hashing failed' });
      }

      // Vulnerability: Direct insertion without proper parameterization
      const insertQuery = `INSERT INTO users (username, email, password, profile_data) VALUES ('${username}', '${email}', '${hash}', '${
        profileData || '{}'
      }')`;

      db.run(insertQuery, [], function (err) {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ error: 'Registration failed' });
        }

        res.status(201).json({
          message: 'User registered successfully',
          userId: this.lastID,
        });
      });
    });
  });
});

// Login endpoint with vulnerabilities
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // Vulnerability: SQL injection through string concatenation
  const query = `SELECT * FROM users WHERE username = '${sanitizeInput(
    username
  )}' OR email = '${sanitizeInput(username)}'`;

  db.get(query, [], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      // Vulnerability: Information disclosure - tells attacker user doesn't exist
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Vulnerability: No rate limiting on login attempts
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Authentication error' });
      }

      if (!result) {
        // Vulnerability: Failed login attempts not properly tracked
        const updateQuery = `UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ${user.id}`;
        db.run(updateQuery);

        // Vulnerability: Information disclosure - different messages for wrong password vs wrong username
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Reset failed attempts and set last login
      const resetQuery = `UPDATE users SET failed_login_attempts = 0, last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}`;
      db.run(resetQuery);

      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    });
  });
});

// Dashboard endpoint
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }

  // Vulnerability: Direct query concatenation
  const query = `SELECT username, email, role, created_at, last_login, profile_data FROM users WHERE id = ${req.session.userId}`;

  db.get(query, [], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      req.session.destroy();
      return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  });
});

// Get user profile - API endpoint
app.get('/api/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Vulnerability: SQL injection in query
  const query = `SELECT * FROM users WHERE id = ${req.session.userId}`;

  db.get(query, [], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Vulnerability: Exposing sensitive data
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      last_login: user.last_login,
      failed_login_attempts: user.failed_login_attempts, // Shouldn't expose this
      profile_data: user.profile_data,
    });
  });
});

// Update profile endpoint
app.post('/api/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { email, profileData } = req.body;

  // Vulnerability: No input validation and SQL injection
  const query = `UPDATE users SET email = '${email}', profile_data = '${profileData}' WHERE id = ${req.session.userId}`;

  db.run(query, [], function (err) {
    if (err) {
      console.error('Update error:', err);
      return res.status(500).json({ error: 'Update failed' });
    }

    res.json({ message: 'Profile updated successfully' });
  });
});

// Admin endpoint with improper access control
app.get('/admin/users', (req, res) => {
  // Vulnerability: Weak role checking
  if (req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Vulnerability: Exposing all user data including passwords
  const query = 'SELECT * FROM users ORDER BY created_at DESC';

  db.all(query, [], (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(users); // Vulnerability: Returns password hashes
  });
});

// Search users endpoint with SQL injection
app.get('/api/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query required' });
  }

  // Vulnerability: Direct SQL injection
  const query = `SELECT username, email FROM users WHERE username LIKE '%${q}%' OR email LIKE '%${q}%'`;

  db.all(query, [], (err, users) => {
    if (err) {
      console.error('Search error:', err);
      return res.status(500).json({ error: 'Search failed' });
    }

    res.json(users);
  });
});

// Admin SQL query page
app.get('/admin/sql', (req, res) => {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  res.sendFile(path.join(__dirname, 'public', 'admin-sql.html'));
});

// Admin SQL query execution endpoint - EXTREMELY DANGEROUS!
app.post('/admin/sql/execute', (req, res) => {
  // Vulnerability: Weak admin check
  if (req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'SQL query required' });
  }

  // Vulnerability: Direct SQL execution without any sanitization
  // This is EXTREMELY dangerous but perfect for educational purposes
  console.log(`Admin executing SQL: ${query}`);

  // Check if it's a SELECT query for safety display
  const isSelect = query.trim().toLowerCase().startsWith('select');

  if (isSelect) {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({
          error: 'SQL Error',
          details: err.message,
          query: query,
        });
      }

      res.json({
        success: true,
        data: rows,
        rowCount: rows.length,
        query: query,
      });
    });
  } else {
    // For non-SELECT queries (INSERT, UPDATE, DELETE, etc.)
    db.run(query, [], function (err) {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({
          error: 'SQL Error',
          details: err.message,
          query: query,
        });
      }

      res.json({
        success: true,
        message: 'Query executed successfully',
        changes: this.changes,
        lastID: this.lastID,
        query: query,
      });
    });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Demo app running on http://localhost:${PORT}`);
    console.log(
      'This app contains intentional vulnerabilities for testing purposes!'
    );
  });
}

// Export the app for testing
module.exports = app;
