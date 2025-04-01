const User = require("../models/user");
const mysqlConnection = require("../mysql/mysqlConnection");

//Ex. Get All Users
module.exports.getAllUsers = (req, res) => {
    const query = `
        SELECT 
            u.*, 
            p.policy_id, p.start_date, p.end_date, p.policy_status, 
            pl.policy_type, pl.plan_type, pl.policy_overview 
        FROM users u
        LEFT JOIN policy p ON u.user_id = p.user_id
        LEFT JOIN plans pl ON p.plan_id = pl.plan_id
    `;

    mysqlConnection.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching users and policies:", error);
            return res.status(500).json({ error: "Error fetching users and policies" });
        }

        const users = results.reduce((acc, row) => {
            let user = acc.find(u => u.user_id === row.user_id);
            if (!user) {
                user = new User(
                    row.user_id,
                    row.username,
                    row.email,
                    row.password,
                    row.age,
                    row.birthday,
                    row.nationality,
                    row.address,
                    row.role
                );
                user.policies = [];
                acc.push(user);
            }

            if (row.policy_id) {
                user.policies.push({
                    policy_id: row.policy_id,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    policy_status: row.policy_status,
                    plan: {
                        policy_type: row.policy_type,
                        plan_type: row.plan_type,
                        policy_overview: row.policy_overview
                    }
                });
            }

            return acc;
        }, []);

        res.json(users);
    });
};