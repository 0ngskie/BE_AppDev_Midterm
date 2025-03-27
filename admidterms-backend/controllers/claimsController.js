const Claim = require("../models/claims");
const mysqlConnection = require("../mysql/mysqlConnection");
const sanitize = {
  string: (value) => (typeof value === "string" ? value.trim() : value),
  number: (value) => (isNaN(Number(value)) ? null : Number(value)),
  date: (value) => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
  },
};

//Get All Claims
exports.getAllClaims = (req, res) => {
  const query = "SELECT * FROM claims ORDER BY claim_date DESC";

  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching claims:", error);
      return res.status(500).json({ error: "Error fetching claims" });
    }

    const claims = results.map(
      (claim) =>
        new Claim(
          claim.claim_id,
          claim.claim_date,
          claim.amount_claimed,
          claim.status,
          claim.policy_id
        )
    );
    res.json(claims);
  });
};

//Create a new claim
exports.createClaim = (req, res) => {
  const sanitized = {
    claim_date: sanitize.date(req.body.claim_date),
    amount_claimed: sanitize.number(req.body.amount_claimed),
    status: sanitize.string(req.body.status),
    policy_id: sanitize.number(req.body.policy_id),
  };

  const { claim_date, amount_claimed, status, policy_id } = sanitized;

  //validations

  if (!amount_claimed || amount_claimed <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number." });
  }

  if (!Claim.validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ error: "Status must be either 'Unclaimed' or 'Claimed'." });
  }

  if (!policy_id || policy_id <= 0) {
    return res
      .status(400)
      .json({ error: "Policy ID must be a positive number." });
  }

  if (!claim_date || isNaN(Date.parse(claim_date))) {
    return res.status(400).json({ error: "Invalid date format." });
  }

  const query =
    "INSERT INTO claims (claim_date, amount_claimed, status, policy_id) VALUES (?, ?, ?, ?)";
  const values = [claim_date, amount_claimed, status, policy_id];

  mysqlConnection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error creating claim:", error);
      return res.status(500).json({ error: "Error creating claim" });
    }

    const newClaim = new Claim(
      results.insertId,
      claim_date,
      amount_claimed,
      status,
      policy_id
    );
    res.status(201).json(newClaim);
  });
};

//Get a claim by ID
exports.getClaim = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM claims WHERE claim_id = ?";

  mysqlConnection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error fetching claim:", error);
      return res.status(500).json({ error: "Error fetching claim" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Claim not found" });
    }

    const claim = new Claim(
      results[0].claim_id,
      results[0].claim_date,
      results[0].amount_claimed,
      results[0].status,
      results[0].policy_id
    );
    res.json(claim);
  });
};

//Get claims by policy ID
exports.getClaimsByPolicy = (req, res) => {
  const { policyid } = req.params;
  if (!policyid || isNaN(parseInt(policyid)) || parseInt(policyid) <= 0) {
    return res.status(400).json({
      error: "Policy ID must be a positive number",
      example: "/policy/123",
    });
  }

  const query =
    "SELECT * FROM claims WHERE policy_id = ? ORDER BY claim_date DESC";
  mysqlConnection.query(query, [policyid], (error, results) => {
    if (error) {
      console.error("Error fetching claims:", error);
      return res.status(500).json({ error: "Error fetching claims" });
    }
    const claims = results.map(
      (claim) =>
        new Claim(
          claim.claim_id,
          claim.claim_date,
          claim.amount_claimed,
          claim.status,
          claim.policy_id
        )
    );
    res.json(claims);
  });
};

//Get all unclaimed claims
exports.getAllUnclaimedClaims = (req, res) => {
  const query =
    "SELECT * FROM claims WHERE status = 'Unclaimed' ORDER BY claim_date DESC";

  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching claims:", error);
      return res.status(500).json({ error: "Error fetching claims" });
    }

    const claims = results.map(
      (claim) =>
        new Claim(
          claim.claim_id,
          claim.claim_date,
          claim.amount_claimed,
          claim.status,
          claim.policy_id
        )
    );

    res.json(claims);
  });
};

//Update Claims
exports.updateClaim = (req, res) => {
  const { id } = req.params;
  const updates = {
    claim_date: req.body.claim_date
      ? sanitize.date(req.body.claim_date)
      : undefined,
    amount_claimed: req.body.amount_claimed
      ? sanitize.number(req.body.amount_claimed)
      : undefined,
    status: req.body.status ? sanitize.string(req.body.status) : undefined,
    policy_id: req.body.policy_id
      ? sanitize.number(req.body.policy_id)
      : undefined,
  };

  const claimId = sanitize.number(id);
  if (!claimId) {
    return res.status(400).json({ error: "Invalid claim ID" });
  }

  const { claim_date, amount_claimed, status, policy_id } = req.body;

  //validation
  if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return res.status(400).json({ error: "Invalid claim ID" });
  }

  if (
    amount_claimed &&
    (isNaN(parseFloat(amount_claimed)) || parseFloat(amount_claimed) <= 0)
  ) {
    return res.status(400).json({ error: "Amount must be a positive number" });
  }

  if (status && !["Unclaimed", "Claimed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  this.getClaim(
    { params: { id } },
    {
      json: (existingClaim) => {
        if (existingClaim.status === "Claimed") {
          return res
            .status(403)
            .json({ error: "Claimed requests cannot be modified" });
        }

        const query = `
        UPDATE claims 
        SET 
          claim_date = COALESCE(?, claim_date),
          amount_claimed = COALESCE(?, amount_claimed),
          status = COALESCE(?, status),
          policy_id = COALESCE(?, policy_id)
        WHERE claim_id = ?
      `;
        const values = [claim_date, amount_claimed, status, policy_id, id];

        mysqlConnection.query(query, values, (error, results) => {
          if (error) {
            console.error("Error updating claim:", error);
            return res.status(500).json({ error: "Error updating claim" });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Claim not found" });
          }
          res.json({ message: "Claim updated successfully" });
        });
      },
      status: (code) => ({
        json: (err) => res.status(code).json(err),
      }),
    },
    () => {}
  );
};

// Delete a claim
exports.deleteClaim = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM claims WHERE claim_id = ?";

  mysqlConnection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting claim:", error);
      return res.status(500).json({ error: "Error deleting claim" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.json({ message: "Claim deleted" });
  });
};
