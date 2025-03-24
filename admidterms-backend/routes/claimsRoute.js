const express = require("express");
const router = express.Router();
const claimsController = require("../controllers/claimsController");

router.get("/", claimsController.getAllClaims);

router.post("/", claimsController.createClaim);
router.get("/:id", claimsController.getClaim);
router.get("/policy/:policyid", claimsController.getClaimsByPolicy);
router.patch("/:id/status", claimsController.updateClaimStatus);
router.delete("/:id", claimsController.deleteClaim);

module.exports = router;
