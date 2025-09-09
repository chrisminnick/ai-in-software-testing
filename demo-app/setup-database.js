const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'users.db');

// Create database and tables
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        failed_login_attempts INTEGER DEFAULT 0,
        last_login DATETIME,
        profile_data TEXT
    )`);

    // Create sessions table
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        expires_at DATETIME,
        data TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Insert some test users with intentionally weak practices
    const saltRounds = 10;
    
    // Create users after tables are ready
    const createUsers = async () => {
        try {
            // Admin user with predictable password
            const adminHash = await new Promise((resolve, reject) => {
                bcrypt.hash('admin123', saltRounds, (err, hash) => {
                    if (err) reject(err);
                    else resolve(hash);
                });
            });
            
            await new Promise((resolve, reject) => {
                db.run(`INSERT OR IGNORE INTO users (username, email, password, role) 
                        VALUES ('admin', 'admin@demo.com', ?, 'admin')`, [adminHash], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Test user with weak password
            const userHash = await new Promise((resolve, reject) => {
                bcrypt.hash('password', saltRounds, (err, hash) => {
                    if (err) reject(err);
                    else resolve(hash);
                });
            });
            
            await new Promise((resolve, reject) => {
                db.run(`INSERT OR IGNORE INTO users (username, email, password, role) 
                        VALUES ('testuser', 'test@demo.com', ?, 'user')`, [userHash], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // User with profile data
            const johnHash = await new Promise((resolve, reject) => {
                bcrypt.hash('user123', saltRounds, (err, hash) => {
                    if (err) reject(err);
                    else resolve(hash);
                });
            });
            
            await new Promise((resolve, reject) => {
                db.run(`INSERT OR IGNORE INTO users (username, email, password, role, profile_data) 
                        VALUES ('john_doe', 'john@demo.com', ?, 'user', ?)`, 
                        [johnHash, '{"name": "John Doe", "bio": "Regular user"}'], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            console.log('Database setup complete!');
            console.log('Test users created:');
            console.log('- admin / admin123 (admin role)');
            console.log('- testuser / password (user role)');
            console.log('- john_doe / user123 (user role)');
            
        } catch (error) {
            console.error('Error creating users:', error);
        } finally {
            db.close();
        }
    };

    createUsers();
});
