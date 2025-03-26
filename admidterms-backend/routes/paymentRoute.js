const express = require('express');
const router = express.Router();
const mysql = require('../mysql/mysqlConnection');

// Create Payment
router.post('/', (req, res) => {
    const { payment_date, amount_paid, status, policy_id } = req.body;
    const sql = 'INSERT INTO payments (payment_date, amount_paid, status, policy_id) VALUES (?, ?, ?, ?)';
    
    mysql.query(sql, [payment_date, amount_paid, status, policy_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Payment added successfully', id: result.insertId });
    });
});

// Get All Payments
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM payments';
    
    mysql.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Get Payment by ID
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM payments WHERE payment_id = ?';
    
    mysql.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(result[0]);
    });
});

// Update Payment
router.put('/:id', (req, res) => {
    const { payment_date, amount_paid, status, policy_id } = req.body;
    const sql = 'UPDATE payments SET payment_date = ?, amount_paid = ?, status = ?, policy_id = ? WHERE payment_id = ?';
    
    mysql.query(sql, [payment_date, amount_paid, status, policy_id, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found or no changes made' });
        }
        res.status(200).json({ message: 'Payment updated successfully' });
    });
});

// Delete Payment
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM payments WHERE payment_id = ?';
    
    mysql.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    });
});

module.exports = router;