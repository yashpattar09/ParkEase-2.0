const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;

        // Validate required fields
        if (!full_name || !email || !phone || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Check if user already exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            if (row) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'User already exists with this email' 
                });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert new user
            db.run(
                'INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)',
                [full_name, email, phone, hashedPassword],
                function(err) {
                    if (err) {
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Error creating user' 
                        });
                    }

                    // Generate JWT token
                    const token = jwt.sign(
                        { userId: this.lastID, email: email },
                        'your-secret-key',
                        { expiresIn: '24h' }
                    );

                    // Create wallet for new user
                    db.run(
                        'INSERT INTO wallets (user_id) VALUES (?)',
                        [this.lastID],
                        (err) => {
                            if (err) {
                                console.error('Error creating wallet:', err.message);
                            }
                        }
                    );

                    res.status(201).json({
                        success: true,
                        message: 'User registered successfully',
                        token: token,
                        user: {
                            id: this.lastID,
                            full_name,
                            email,
                            phone
                        }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Login user
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user by email
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone
                }
            });
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Get user profile
router.get('/profile/:userId', (req, res) => {
    const { userId } = req.params;

    db.get('SELECT id, full_name, email, phone, created_at FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user: user
        });
    });
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { full_name, phone } = req.body;

        db.run(
            'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
            [full_name, phone, userId],
            function(err) {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error updating profile' 
                    });
                }

                res.json({
                    success: true,
                    message: 'Profile updated successfully'
                });
            }
        );
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

module.exports = router;
