const Claim = require("../models/claims");

// Create a new claim
exports.createClaim = (req, res) => {
  Claim.create(req.body, (err, newClaim) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json(newClaim);
  });
};

// Get all claims
exports.getAllClaims = (req, res) => {
  Claim.getAll((err, claims) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(claims);
  });
};

//  Get a claim by claim_id
exports.getClaim = (req, res) => {
  Claim.findByID(req.params.id, (err, claim) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json(claim);
  });
};

// Get all claims by policy_id
exports.getClaimsByPolicy = (req, res) => {
  Claim.findByPolicyId(req.params.policyid, (err, claim) => {
    if (err) return res.status(500).json({ message: err.message });
    if (isNaN(req.params.policyid)) {
      return res.status(400).json({ error: "Policy ID must be a number" });
    }
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json(claim);
  });
};

// Get all claims by status
exports.getClaimsByStatus = (req, res) => {
  const status = req.params.status;

  const allowedStatuses = ["Claimed", "Unclaimed"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid status",
      allowedStatuses: allowedStatuses,
    });
  }

  Claim.findByStatus(status, (err, claims) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        message: "Database operation failed",
        error: err.message,
      });
    }

    if (!claims || claims.length === 0) {
      return res.status(404).json({
        message: "No claims found with this status",
        status: status,
      });
    }

    res.json({
      count: claims.length,
      status: status,
      data: claims,
    });
  });
};

// Update the status of a claim
exports.updateClaimStatus = (req, res) => {
  Claim.updateStatus(req.params.id, req.body.status, (err, affectedRows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.json({ message: "Claim status updated" });
  });
};

// Delete a claim
exports.deleteClaim = (req, res) => {
  Claim.delete(req.params.id, (err, affectedRows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.json({ message: "Claim deleted" });
  });
};
