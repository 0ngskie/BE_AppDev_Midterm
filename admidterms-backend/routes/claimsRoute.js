const express = require("express");
const router = express.Router();
const claimsController = require("../controllers/claimsController");

// Ensure that all required methods exist
console.log(claimsController);

// Get all claims
router.get("/", claimsController.getAllClaims);

// Get unclaimed claims
router.get("/unclaimed", claimsController.getUnclaimedClaims);

// Get a specific claim by ID
router.get("/:id", claimsController.getClaim);

// Get claims by policy number
router.get("/policy/:policyNumber", claimsController.getClaimsByPolicyId);

// **Fix this line: Ensure createClaim is defined**
router.post("/", claimsController.createClaim);

// Update an existing claim
router.put("/:id", claimsController.updateClaim);

// Delete a claim
router.delete("/:id", claimsController.deleteClaim);

module.exports = router;
