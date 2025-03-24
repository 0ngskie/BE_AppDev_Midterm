const Claim = require("../models/claims");

exports.createClaim = (req, res) => {
  Claim.create(req.body, (err, newClaim) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json(newClaim);
  });
};

exports.getAllClaims = (req, res) => {
  Claim.getAll((err, claims) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(claims);
  });
};

exports.getClaim = (req, res) => {
  Claim.findByID(req.params.id, (err, claim) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json(claim);
  });
};

exports.getClaimsByPolicy = (req, res) => {
  Claim.findByPolicyId(req.params.policyid, (err, claims) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(claims);
  });
};

exports.updateClaimStatus = (req, res) => {
  Claim.updateStatus(req.params.id, req.body.status, (err, affectedRows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.json({ message: "Claim status updated" });
  });
};

exports.deleteClaim = (req, res) => {
  Claim.delete(req.params.id, (err, affectedRows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.json({ message: "Claim deleted" });
  });
};
