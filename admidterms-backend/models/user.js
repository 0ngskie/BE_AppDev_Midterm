// Honestly don't know what to do with this
class User {
    constructor(user_id, username, email, password, age, birthday, nationality, address, role) {
        this.user_id = user_id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.age = age;
        this.birthday = birthday;
        this.nationality = nationality;
        this.address = address;
        this.role = role;
    }
}

module.exports = User;