const db = require('../mysql/mysqlConnection');
const Payment = require('../models/payment');

exports.createPayment = (req, res) => {
    console.log("Request received:", req.body);

    const { payment_frequency, preferred_due_date, payment_method, payment_due_date, policy_id } = req.body;

    // Fetch the policy's plan details
    const planQuery = `
        SELECT p.policy_type, p.plan_type
        FROM policy po
        JOIN plans p ON po.plan_id = p.plan_id
        WHERE po.policy_id = ?
    `;

    db.query(planQuery, [policy_id], (err, results) => {
        if (err) {
            console.error("Error fetching policy plan:", err);
            return res.status(500).json({ error: "Database error fetching policy plan" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Policy not found" });
        }

        const { policy_type, plan_type } = results[0];

        // Pricing Table
        const priceList = {
            "Retirement": { "Basic": 2000, "Standard": 3800, "Premium": 7000 },
            "Education": { "Basic": 7200, "Standard": 2000, "Premium": 3500 },
            "Health": { "Basic": 1000, "Standard": 2200, "Premium": 4500 },
            "Auto": { "Basic": 900, "Standard": 1500, "Premium": 2800 }
        };

        let amountDue = priceList[policy_type]?.[plan_type] || 0;
        if (amountDue === 0) {
            return res.status(400).json({ error: "Invalid policy type or plan type" });
        }

        // Check for overdue payments
        const today = new Date();
        const dueDate = new Date(payment_due_date);
        let paymentStatus = 'Pending';

        if (dueDate < today) {
            amountDue *= 2; // Double the payment if overdue
            paymentStatus = 'Over Due';
        }

        // Insert payment record
        const sql = `
            INSERT INTO payments 
            (payment_frequency, preferred_due_date, payment_method, amount_due, payment_due_date, payment_status, policy_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [payment_frequency, preferred_due_date, payment_method, amountDue, payment_due_date, paymentStatus, policy_id],
            (err, insertResult) => {
                if (err) {
                    console.error("Payment insert error:", err);
                    return res.status(500).json({ error: "Error inserting payment: " + err.message });
                }

                console.log("Payment inserted successfully:", insertResult);

                return res.status(201).json({
                    message: 'Payment created successfully',
                    payment: {
                        id: insertResult.insertId,
                        policy_id,
                        payment_frequency,
                        preferred_due_date,
                        payment_method,
                        amount_due: amountDue,
                        payment_due_date,
                        payment_status: paymentStatus
                    }
                });
            }
        );
    });
};

  
  // READ ALL PAYMENTS
  exports.getAllPayments = (req, res) => {
    db.query(
      `SELECT p.*, po.policy_status, u.first_name, u.last_name 
       FROM payments p
       JOIN policy po ON p.policy_id = po.policy_id
       JOIN users u ON po.user_id = u.user_id
       ORDER BY p.payment_due_date DESC`,
      (err, results) => {
        if (err) {
          console.error('Error fetching payments:', err);
          return res.status(500).json({ error: 'Database error when fetching payments' });
        }
        
        return res.status(200).json({
          count: results.length,
          payments: results
        });
      }
    );
  };
  
  // READ ONE PAYMENT
  exports.getPaymentById = (req, res) => {
    const { id } = req.params;
    
    db.query(
      `SELECT p.*, po.policy_status, po.start_date, po.end_date, u.first_name, u.last_name 
       FROM payments p
       JOIN policy po ON p.policy_id = po.policy_id
       JOIN users u ON po.user_id = u.user_id
       WHERE p.payment_id = ?`,
      [id],
      (err, results) => {
        if (err) {
          console.error('Error fetching payment:', err);
          return res.status(500).json({ error: 'Database error when fetching payment' });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ error: 'Payment not found' });
        }
        
        return res.status(200).json(results[0]);
      }
    );
  };
  
  // GET PAYMENTS BY POLICY ID
  exports.getPaymentsByPolicyId = (req, res) => {
    const { policyId } = req.params;
    
    db.query(
      'SELECT * FROM payments WHERE policy_id = ? ORDER BY payment_due_date DESC',
      [policyId],
      (err, results) => {
        if (err) {
          console.error('Error fetching policy payments:', err);
          return res.status(500).json({ error: 'Database error when fetching policy payments' });
        }
        
        return res.status(200).json({
          count: results.length,
          payments: results
        });
      }
    );
  };
  
  // UPDATE PAYMENT
  exports.updatePayment = (req, res) => {
    const { id } = req.params;
    const { 
      payment_frequency, 
      preferred_due_date, 
      payment_method, 
      amount_due,
      payment_due_date,
      payment_status
    } = req.body;
    
    // Validate payment_status is one of the allowed enum values
    if (payment_status && !['Paid', 'Pending', 'Over Due'].includes(payment_status)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }
    
    // Build update query dynamically based on provided fields
    let updateFields = [];
    let queryParams = [];
    
    if (payment_frequency) {
      if (!['Monthly', 'Quarterly', 'Bi-Annually', 'Annually'].includes(payment_frequency)) {
        return res.status(400).json({ error: 'Invalid payment frequency' });
      }
      updateFields.push('payment_frequency = ?');
      queryParams.push(payment_frequency);
    }
    
    if (preferred_due_date) {
      updateFields.push('preferred_due_date = ?');
      queryParams.push(preferred_due_date);
    }
    
    if (payment_method) {
      if (!['Bank Transfer', 'Gcash', 'Credit/Debit', 'Others'].includes(payment_method)) {
        return res.status(400).json({ error: 'Invalid payment method' });
      }
      updateFields.push('payment_method = ?');
      queryParams.push(payment_method);
    }
    
    if (amount_due) {
      updateFields.push('amount_due = ?');
      queryParams.push(amount_due);
    }
    
    if (payment_due_date) {
      updateFields.push('payment_due_date = ?');
      queryParams.push(payment_due_date);
    }
    
    if (payment_status) {
      updateFields.push('payment_status = ?');
      queryParams.push(payment_status);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    // Add id to query params
    queryParams.push(id);
    
    const sql = `UPDATE payments SET ${updateFields.join(', ')} WHERE payment_id = ?`;
    
    db.query(sql, queryParams, (err, result) => {
      if (err) {
        console.error('Error updating payment:', err);
        return res.status(500).json({ error: 'Database error when updating payment' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Payment not found or no changes made' });
      }
      
      // Fetch updated payment
      db.query('SELECT * FROM payments WHERE payment_id = ?', [id], (err, results) => {
        if (err) {
          return res.status(200).json({ message: 'Payment updated successfully' });
        }
        
        return res.status(200).json({
          message: 'Payment updated successfully',
          payment: results[0]
        });
      });
    });
  };
  
  // DELETE PAYMENT
  exports.deletePayment = (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM payments WHERE payment_id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error deleting payment:', err);
        return res.status(500).json({ error: 'Database error when deleting payment' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      
      return res.status(200).json({ message: 'Payment deleted successfully' });
    });
  };