const db = require("../mysql/mysqlConnection");

// Get all plans (with tiers)
exports.getAllPlans = (req, res) => {
    db.query("SELECT * FROM plans", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

// Get a single plan by ID (with tier details)
exports.getPlanById = (req, res) => {
    db.query("SELECT * FROM plans WHERE plan_id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Plan not found" });
        res.json(result[0]);
    });
};

// Create a new plan with tiers
exports.createPlan = (req, res) => {
    const { plan_name, tier, amount, monthly_cost, duration } = req.body;

    if (!plan_name || !tier || !amount || !monthly_cost || !duration) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query(
        "INSERT INTO plans (plan_name, tier, amount, monthly_cost, duration) VALUES (?, ?, ?, ?, ?)",
        [plan_name, tier, amount, monthly_cost, duration],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Plan created", plan_id: result.insertId });
        }
    );
};

// Update an existing plan tier
exports.updatePlan = (req, res) => {
    const { plan_name, tier, amount, monthly_cost, duration } = req.body;

    if (!plan_name || !tier || !amount || !monthly_cost || !duration) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query(
        "UPDATE plans SET plan_name = ?, tier = ?, amount = ?, monthly_cost = ?, duration = ? WHERE plan_id = ?",
        [plan_name, tier, amount, monthly_cost, duration, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Plan not found" });
            res.json({ message: "Plan updated" });
        }
    );
};

// Delete a plan
exports.deletePlan = (req, res) => {
    db.query("DELETE FROM plans WHERE plan_id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Plan not found" });
        res.json({ message: "Plan deleted" });
    });
};
