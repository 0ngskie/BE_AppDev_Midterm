class Payment {
    constructor(payment_id, payment_date, amount_paid, status, policy_id, payment_frequency, preferred_due_date, payment_method) {
        this.payment_id = payment_id;
        this.payment_date = payment_date;
        this.amount_paid = amount_paid;
        this.status = status;
        this.policy_id = policy_id;
        this.payment_frequency = payment_frequency;
        this.preferred_due_date = preferred_due_date;
        this.payment_method = payment_method;
    }
}

module.exports = Payment;
