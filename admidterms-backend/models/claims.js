const mysqlConnection = require("../mysql/mysqlConnection");

class Claim {
  // Create a new claim
  static async create(claimData, callback) {
    const {
      claim_date,
      amount_claimed,
      status = "Claimed",
      policy_id,
    } = claimData;

    mysqlConnection.query(
      "INSERT INTO claims (claim_date, amount_claimed, status, policy_id) VALUES (?, ?, ?, ?)",
      [claim_date, amount_claimed, status, policy_id],
      (err, result) => {
        if (err) return callback(err);
        this.findByID(result.insertId, callback);
      }
    );
  }

  // Get all claims
  static getAll(callback) {
    mysqlConnection.query(
      "SELECT * FROM claims ORDER BY claim_date DESC",
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  }

  // Get a claim by claim_id
  static findByID(claimId, callback) {
    mysqlConnection.query(
      "SELECT * FROM claims WHERE claim_id = ?",
      [claimId],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]);
      }
    );
  }

  // Update the status of a claim
  static updateStatus(claimId, newStatus, callback) {
    mysqlConnection.query(
      "UPDATE claims SET status = ? WHERE claim_id = ?",
      [newStatus, claimId],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.affectedRows);
      }
    );
  }

  // Get all claims by policy_id
  static findByPolicyId(policyId, callback) {
    mysqlConnection.query(
      "SELECT * FROM claims WHERE policy_id = ? ORDER BY claim_date DESC",
      [policyId],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  }

  // Get all claims by status
  static findByStatus(status, callback) {
    mysqlConnection.query(
      "SELECT * FROM claims WHERE status = ? ORDER BY claim_date DESC",
      [status],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  }

  // Delete a claim
  static delete(claimId, callback) {
    mysqlConnection.query(
      "DELETE FROM claims WHERE claim_id = ?",
      [claimId],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.affectedRows);
      }
    );
  }
}

module.exports = Claim;
