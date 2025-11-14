const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Get wallet balance
router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    db.get('SELECT balance FROM wallets WHERE user_id = ?', [userId], (err, wallet) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }

        if (!wallet) {
            return res.status(404).json({ 
                success: false, 
                message: 'Wallet not found' 
            });
        }

        res.json({
            success: true,
            balance: wallet.balance
        });
    });
});

// Add money to wallet
router.post('/add/:userId', (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid amount'
        });
    }

    db.run(
        'UPDATE wallets SET balance = balance + ? WHERE user_id = ?',
        [amount, userId],
        function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error updating wallet'
                });
            }

            // Get updated balance
            db.get('SELECT balance FROM wallets WHERE user_id = ?', [userId], (err, wallet) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error getting updated balance'
                    });
                }

                res.json({
                    success: true,
                    message: 'Amount added successfully',
                    balance: wallet.balance
                });
            });
        }
    );
});

// Withdraw money from wallet
router.post('/withdraw/:userId', (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid amount'
        });
    }

    // Check if sufficient balance exists
    db.get('SELECT balance FROM wallets WHERE user_id = ?', [userId], (err, wallet) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient balance'
            });
        }

        // Process withdrawal
        db.run(
            'UPDATE wallets SET balance = balance - ? WHERE user_id = ?',
            [amount, userId],
            function(err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating wallet'
                    });
                }

                res.json({
                    success: true,
                    message: 'Withdrawal successful',
                    balance: wallet.balance - amount
                });
            }
        );
    });
});

module.exports = router;