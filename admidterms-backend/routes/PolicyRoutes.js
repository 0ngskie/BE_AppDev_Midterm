const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");

 
router.post("/policies", policyController.createPolicy);

 
router.get("/policies", policyController.getAllPolicies);

 
router.get("/policies/:id", policyController.getPolicyById);

 
router.put("/policies/:id", policyController.updatePolicy);

 
router.delete("/policies/:id", policyController.deletePolicy);

module.exports = router;