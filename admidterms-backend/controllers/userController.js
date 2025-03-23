const User = require("../models/user");
const mysqlConnection = require("../mysql/mysqlConnection");

//Ex. Get All Users
module.exports.getAllUsers = (req, res) => {

    const query = "SELECT * FROM users";
    mysqlConnection.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ error: "Error fetching users" });
        }

        // Map results to User.
        const users = results.map(user => new User(
            user.user_id,
            user.username,
            user.email,
            user.password,
            user.age,
            user.birthday,
            user.nationality,
            user.address,
            user.role
        ));

        res.json(users);
    });
};