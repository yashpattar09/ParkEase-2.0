const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Get all parking locations
router.get('/', (req, res) => {
    db.all(
        'SELECT * FROM parking_locations ORDER BY name',
        (err, locations) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            res.json({
                success: true,
                locations: locations
            });
        }
    );
});

// Get parking location by ID
router.get('/:locationId', (req, res) => {
    const { locationId } = req.params;

    db.get(
        'SELECT * FROM parking_locations WHERE id = ?',
        [locationId],
        (err, location) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            if (!location) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Location not found' 
                });
            }

            res.json({
                success: true,
                location: location
            });
        }
    );
});

// Update parking location slots
router.put('/:locationId/slots', (req, res) => {
    const { locationId } = req.params;
    const { total_slots, available_slots } = req.body;

    if (total_slots === undefined || available_slots === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: 'total_slots and available_slots are required' 
        });
    }

    db.run(
        'UPDATE parking_locations SET total_slots = ?, available_slots = ? WHERE id = ?',
        [total_slots, available_slots, locationId],
        function(err) {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error updating slots' 
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Location not found' 
                });
            }

            res.json({
                success: true,
                message: 'Slots updated successfully'
            });
        }
    );
});

// Add new parking location
router.post('/', (req, res) => {
    const { name, address, total_slots, available_slots, latitude, longitude } = req.body;

    if (!name || !address || total_slots === undefined || available_slots === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: 'name, address, total_slots, and available_slots are required' 
        });
    }

    db.run(
        'INSERT INTO parking_locations (name, address, total_slots, available_slots, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
        [name, address, total_slots, available_slots, latitude, longitude],
        function(err) {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error creating location' 
                });
            }

            res.status(201).json({
                success: true,
                message: 'Location created successfully',
                location_id: this.lastID
            });
        }
    );
});

// Get location statistics
router.get('/:locationId/stats', (req, res) => {
    const { locationId } = req.params;

    // Get location details
    db.get(
        'SELECT * FROM parking_locations WHERE id = ?',
        [locationId],
        (err, location) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }

            if (!location) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Location not found' 
                });
            }

            // Get booking statistics
            db.get(
                `SELECT 
                    COUNT(*) as total_bookings,
                    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
                    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings
                 FROM bookings 
                 WHERE location_id = ?`,
                [locationId],
                (err, stats) => {
                    if (err) {
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Database error' 
                        });
                    }

                    res.json({
                        success: true,
                        location: location,
                        statistics: stats
                    });
                }
            );
        }
    );
});

module.exports = router;
