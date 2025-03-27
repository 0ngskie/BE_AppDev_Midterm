const Payment = require("../models/payment");
const mysqlConnection = require("../mysql/mysqlConnection");

// Create payment
module.exports.createPayment = (req, res) => {
    const { payment_date, amount_paid, status, policy_id } = req.body;
    const sql = 'INSERT INTO payments (payment_date, amount_paid, status, policy_id) VALUES (?, ?, ?, ?)';
    
    mysql.query(sql, [payment_date, amount_paid, status, policy_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Payment added successfully', id: result.insertId });
    });
};

// Get All Payments
module.exports.getAllPayments = (req, res) => {
    const query = "SELECT * FROM payments";
    mysqlConnection.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching payments:", error);
            return res.status(500).json({ error: "Error fetching payments" });
        }

        // Map results to Payment.
        const payments = results.map(payment => new Payment(
            payment.payment_id,
            payment.payment_date,
            payment.amount_paid,
            payment.status,
            payment.policy_id
        ));

        res.json(payments);
    });
};

// Get Payment by ID
module.exports.getPaymentID = (req, res) => {
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
};

// Update payment
module.exports.updatePayment = (req, res) => {
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
};

// Delete payment
module.exports.deletePayment = (req, res) => {
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
};
