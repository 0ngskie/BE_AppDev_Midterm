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

// BASIC CRUD

//Get User by ID
module.exports.getUser = (req, res) => {

    const { user_id } = req.params;

    const query = "SELECT * FROM users WHERE user_id = ?";

    mysqlConnection.query(query, user_id, (error, results) => {
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

//Create
module.exports.createUser = (req, res) => {
    const { username, email, password, age, birthday, nationality, address, role } = req.body;

    //Username and Email Validation
    const checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
    mysqlConnection.query(checkQuery, [username, email], (error, results) => {
        if (error) {
            console.error("Error checking existing user:", error);
            return res.status(500).json({ error: "Error checking existing user" });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: "Username or Email already exists" });
        }

        //Age Validation
        const birthDate = new Date(birthday);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
            calculatedAge--;
        }

        if (calculatedAge < 18 || age < 18) {
            return res.status(403).json({ error: "User must be at least 18 years old" });
        }

        const query = "INSERT INTO users (username, email, password, age, birthday, nationality, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [username, email, password, age, birthday, nationality, address, role];

        mysqlConnection.query(query, values, (error, results) => {
            if (error) {
                console.error("Error creating user:", error);
                return res.status(500).json({ error: "Error creating user" });
            }

            res.status(201).json({ message: "User created successfully", user_id: results.insertId });
        });
    });
};

//Update
module.exports.updateUser = (req, res) => {

    const { user_id } = req.params;

    const {username, email, password, age, birthday, nationality, address, role } = req.body;

    const query = "UPDATE users SET username = ?, email = ?, password = ?, age = ?, birthday = ?, nationality = ?, address = ?, role = ? WHERE user_id = ?";

    const values = [username, email, password, age, birthday, nationality, address, role, user_id];

    mysqlConnection.query(query, values, (error, results) => {
        if (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ error: "Error updating user" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully"});
    });
};

//Update Password
module.exports.updatePassword = (req, res) => {
    const { user_id } = req.params;
    const { password } = req.body;

    const query = "UPDATE users SET password = ? WHERE user_id = ?";
    mysqlConnection.query(query, [password, user_id], (error, results) => {
        if (error) {
            console.error("Error updating password:", error);
            return res.status(500).json({ error: "Error updating password" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Password updated successfully" });
    });
};

//Delete
module.exports.deleteUser = (req, res) => {

    const { user_id } = req.params;

    const query = "DELETE FROM users WHERE user_id = ?";

    mysqlConnection.query(query, user_id, (error, results) => {
        if (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ error: "Error deleting user" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    });
};