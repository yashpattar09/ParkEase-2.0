const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Create new booking
router.post('/create', (req, res) => {
    try {
        const {
            user_id,
            location_id,
            booking_date,
            start_time,
            end_time,
            duration,
            vehicle_number,
            phone_number,
            payment_mode,
            total_price
        } = req.body;

        // Validate required fields
        if (!user_id || !location_id || !booking_date || !start_time || !end_time || 
            !duration || !vehicle_number || !phone_number || !payment_mode || !total_price) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Check if location exists and has available slots
        db.get('SELECT available_slots FROM parking_locations WHERE id = ?', [location_id], (err, location) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            if (!location) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Parking location not found' 
                });
            }

            if (location.available_slots <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'No available slots at this location' 
                });
            }

            // Create booking
            db.run(
                `INSERT INTO bookings (user_id, location_id, booking_date, start_time, end_time, 
                 duration, vehicle_number, phone_number, payment_mode, total_price) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [user_id, location_id, booking_date, start_time, end_time, duration, 
                 vehicle_number, phone_number, payment_mode, total_price],
                function(err) {
                    if (err) {
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Error creating booking' 
                        });
                    }

                    // Update available slots
                    db.run(
                        'UPDATE parking_locations SET available_slots = available_slots - 1 WHERE id = ?',
                        [location_id],
                        (err) => {
                            if (err) {
                                console.error('Error updating available slots:', err);
                            }
                        }
                    );

                    res.status(201).json({
                        success: true,
                        message: 'Booking created successfully',
                        booking_id: this.lastID
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

// Get user bookings
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        `SELECT b.*, pl.name as location_name, pl.address as location_address 
         FROM bookings b 
         JOIN parking_locations pl ON b.location_id = pl.id 
         WHERE b.user_id = ? 
         ORDER BY b.created_at DESC`,
        [userId],
        (err, bookings) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            res.json({
                success: true,
                bookings: bookings
            });
        }
    );
});

// Get all bookings (admin)
router.get('/all', (req, res) => {
    db.all(
        `SELECT b.*, pl.name as location_name, pl.address as location_address, 
                u.full_name as user_name, u.email as user_email 
         FROM bookings b 
         JOIN parking_locations pl ON b.location_id = pl.id 
         JOIN users u ON b.user_id = u.id 
         ORDER BY b.created_at DESC`,
        (err, bookings) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            res.json({
                success: true,
                bookings: bookings
            });
        }
    );
});

// Get booking by ID
router.get('/:bookingId', (req, res) => {
    const { bookingId } = req.params;

    db.get(
        `SELECT b.*, pl.name as location_name, pl.address as location_address, 
                u.full_name as user_name, u.email as user_email 
         FROM bookings b 
         JOIN parking_locations pl ON b.location_id = pl.id 
         JOIN users u ON b.user_id = u.id 
         WHERE b.id = ?`,
        [bookingId],
        (err, booking) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            if (!booking) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Booking not found' 
                });
            }

            res.json({
                success: true,
                booking: booking
            });
        }
    );
});

// Cancel booking
router.put('/:bookingId/cancel', (req, res) => {
    const { bookingId } = req.params;

    // Get booking details first
    db.get('SELECT location_id FROM bookings WHERE id = ?', [bookingId], (err, booking) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }

        // Update booking status
        db.run(
            'UPDATE bookings SET status = ? WHERE id = ?',
            ['cancelled', bookingId],
            function(err) {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error cancelling booking' 
                    });
                }

                // Increase available slots
                db.run(
                    'UPDATE parking_locations SET available_slots = available_slots + 1 WHERE id = ?',
                    [booking.location_id],
                    (err) => {
                        if (err) {
                            console.error('Error updating available slots:', err);
                        }
                    }
                );

                res.json({
                    success: true,
                    message: 'Booking cancelled successfully'
                });
            }
        );
    });
});

module.exports = router;
