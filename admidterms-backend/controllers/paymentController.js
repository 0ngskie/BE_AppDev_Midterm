const Payment = require("../models/payment");
const mysqlConnection = require("../mysql/mysqlConnection");

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
