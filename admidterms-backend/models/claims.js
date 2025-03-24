const mysqlConnection = require("../mysql/mysqlConnection");

class Claim {
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

  static getAll(callback) {
    mysqlConnection.query(
      "SELECT * FROM claims ORDER BY claim_date DESC",
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  }

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

  static findByStatus(status) {
    mysqlConnection.query(
      "SELECT * FROM claims WHERE status = ? ORDER BY claim_date DESC",
      [status],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.affectedRows);
      }
    );
  }

  static async delete(claimId) {
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
