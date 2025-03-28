const mysqlConnection = require("../mysql/mysqlConnection");

// Fetch all claims
exports.getAllClaims = (req, res) => {
  const query = "SELECT * FROM claims ORDER BY claim_date DESC";
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching claims:", error);
      return res.status(500).json({ error: "Error fetching claims" });
    }
    res.json(results);
  });
};

// Fetch unclaimed claims
exports.getUnclaimedClaims = (req, res) => {
  const query = "SELECT * FROM claims WHERE status = 'Unclaimed'";
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching unclaimed claims:", error);
      return res.status(500).json({ error: "Error fetching unclaimed claims" });
    }
    res.json(results);
  });
};

// Fetch a claim by ID
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
    res.json(results[0]);
  });
};

// Fetch claims by policy ID
exports.getClaimsByPolicyId = (req, res) => {
  const { policyId } = req.params;
  const query = "SELECT * FROM claims WHERE policy_id = ?";
  mysqlConnection.query(query, [policyId], (error, results) => {
    if (error) {
      console.error("Error fetching claims by policy ID:", error);
      return res.status(500).json({ error: "Error fetching claims" });
    }
    res.json(results);
  });
};

// Update a claim
exports.updateClaim = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  const query = "UPDATE claims SET status = ? WHERE claim_id = ?";
  mysqlConnection.query(query, [status, id], (error, results) => {
    if (error) {
      console.error("Error updating claim:", error);
      return res.status(500).json({ error: "Error updating claim" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Claim not found" });
    }
    res.json({ message: "Claim updated successfully" });
  });
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
      return res.status(404).json({ error: "Claim not found" });
    }
    res.json({ message: "Claim deleted successfully" });
  });
};

exports.createClaim = (req, res) => {
  const {
    claimant_name, claimant_dob, claimant_phone, claimant_relationship,
    event_date, event_location, event_description, amount_claimed,
    policy_type, required_documents, claimant_signature, signature_date, 
    status, policy_id, user_id  
  } = req.body;

  console.log("Received user_id:", user_id); 

  // Comprehensive validation with detailed error messages
  const errors = [];

  // Validate each required field with specific checks
  if (!claimant_name) errors.push("Claimant name is required");
  if (!policy_id) errors.push("Policy ID is required");
  if (!user_id) errors.push("User ID is required");
  
  try {
    // Check if user exists
    const userCheckQuery = "SELECT * FROM users WHERE user_id = ?";
    console.log("Executing user check query:", userCheckQuery);
    console.log("With user_id:", user_id);
    
    mysqlConnection.query(userCheckQuery, [user_id], (userError, userResults) => {
      if (userError) {
        console.error("Error checking user:", userError);
        console.error("Query details:", {
          query: userCheckQuery,
          params: [user_id]
        });
        return res.status(500).json({ 
          error: "Database Error", 
          details: userError.message 
        });
      }
      
      console.log("User check results:", userResults);
      
      if (userResults.length === 0) {
        console.log("No user found with ID:", user_id);
        return res.status(400).json({ 
          error: "Validation Failed", 
          details: ["User ID does not exist in the system"] 
        });
      }

      // Get the actual user_id from the database result
      const dbUserId = userResults[0].user_id;
      console.log("Database user_id:", dbUserId);

      // Continue with the rest of the validation
      try {
        // Ensure amount_claimed is a valid number
        const parsedAmount = parseFloat(amount_claimed);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          errors.push("Invalid amount claimed. Must be a positive number.");
        }

        // Date validation
        if (!claimant_dob) errors.push("Date of birth is required");
        if (!event_date) errors.push("Event date is required");
        
        // Phone number validation (basic)
        if (!claimant_phone || !/^(09|\+639)\d{9}$/.test(claimant_phone)) {
          errors.push("Invalid phone number format");
        }

        // Throw validation errors if any exist
        if (errors.length > 0) {
          return res.status(400).json({ 
            error: "Validation Failed", 
            details: errors 
          });
        }

        // Provide default values
        const claimStatus = status || "Unclaimed";
        const claimLocation = event_location || "Not Specified";
        
        // Safely parse required documents
        let parsedDocuments = "[]";
        try {
          parsedDocuments = JSON.stringify(
            typeof required_documents === 'string' 
              ? JSON.parse(required_documents) 
              : required_documents || []
          );
        } catch (parseError) {
          errors.push("Invalid required documents format");
        }

        const query = `
      INSERT INTO claims (
        claim_date, amount_claimed, status, claimant_name, claimant_dob,
        claimant_phone, claimant_relationship, event_date, event_location, 
        event_description, policy_type, required_documents, 
        claimant_signature, signature_date, policy_id, user_id
      ) 
      VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      parsedAmount, claimStatus, claimant_name, claimant_dob,
      claimant_phone, claimant_relationship, event_date, claimLocation, 
      event_description, policy_type, parsedDocuments,
      claimant_signature, signature_date, policy_id, dbUserId
    ];

        console.log("Executing claim creation query:", query);
        console.log("With values:", values);
        
        mysqlConnection.query(query, values, (error, results) => {
          if (error) {
            console.error("Detailed MySQL Error:", error);
            console.error("Query details:", {
              query: query,
              params: values
            });
            return res.status(500).json({ 
              error: "Database Insertion Failed", 
              details: error.message,
              sqlMessage: error.sqlMessage
            });
          }
          
          console.log("Claim creation results:", results);
          
          res.status(201).json({ 
            message: "Claim created successfully", 
            claim_id: results.insertId 
          });
        });

      } catch (unexpectedError) {
        console.error("Unexpected Error in Claim Creation:", unexpectedError);
        res.status(500).json({ 
          error: "Unexpected Error", 
          details: unexpectedError.message 
        });
      }
    });
  } catch (unexpectedError) {
    console.error("Unexpected Error in Claim Creation:", unexpectedError);
    res.status(500).json({ 
      error: "Unexpected Error", 
      details: unexpectedError.message 
    });
  }
};