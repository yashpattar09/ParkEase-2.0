const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'parkease.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeTables();
    }
});

// Initialize database tables
function initializeTables() {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created/verified');
        }
    });

    // Parking locations table
    db.run(`
        CREATE TABLE IF NOT EXISTS parking_locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            total_slots INTEGER NOT NULL,
            available_slots INTEGER NOT NULL,
            latitude REAL,
            longitude REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating parking_locations table:', err.message);
        } else {
            console.log('Parking locations table created/verified');
            initializeParkingLocations();
        }
    });

    // Bookings table
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            location_id INTEGER NOT NULL,
            booking_date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            duration TEXT NOT NULL,
            vehicle_number TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            payment_mode TEXT NOT NULL,
            total_price TEXT NOT NULL,
            status TEXT DEFAULT 'confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (location_id) REFERENCES parking_locations (id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating bookings table:', err.message);
        } else {
            console.log('Bookings table created/verified');
        }
    });
}

// Initialize parking locations with sample data
function initializeParkingLocations() {
    const locations = [
        {
            name: 'College Parking',
            address: 'College, Belagavi',
            total_slots: 40,
            available_slots: 28,
            latitude: 15.8577,
            longitude: 74.52639
        },
        {
            name: 'DMart Tilakwadi',
            address: 'DMart, Tilakwadi, Belagavi',
            total_slots: 25,
            available_slots: 14,
            latitude: 15.8387,
            longitude: 74.5089
        },
        {
            name: 'Nucleus Mall',
            address: 'Nucleus Mall, Belagavi',
            total_slots: 20,
            available_slots: 13,
            latitude: 15.8456,
            longitude: 74.5167
        },
        {
            name: 'INOX Cinema',
            address: 'INOX, Belagavi Central Mall',
            total_slots: 25,
            available_slots: 19,
            latitude: 15.8423,
            longitude: 74.5089
        }
    ];

    // Check if locations already exist
    db.get('SELECT COUNT(*) as count FROM parking_locations', (err, row) => {
        if (err) {
            console.error('Error checking parking locations:', err.message);
        } else if (row.count === 0) {
            // Insert sample locations
            const stmt = db.prepare(`
                INSERT INTO parking_locations (name, address, total_slots, available_slots, latitude, longitude)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            
            locations.forEach(location => {
                stmt.run([
                    location.name,
                    location.address,
                    location.total_slots,
                    location.available_slots,
                    location.latitude,
                    location.longitude
                ]);
            });
            
            stmt.finalize();
            console.log('Sample parking locations inserted');
        }
    });
}

module.exports = db;
