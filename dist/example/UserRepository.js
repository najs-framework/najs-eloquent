"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./User");
class UserRepository {
    async createUser(firstName, lastName) {
        const user = new User_1.User({
            first_name: firstName,
            last_name: lastName
        });
        await user.save();
        return user;
    }
    async updateUser(id, firstName, lastName) {
        const user = await User_1.User.find(id);
        user.first_name = firstName;
        user.last_name = lastName;
        await user.save();
        return user;
    }
    async deleteUser(firstName, lastName) {
        return User_1.User.queryName('Delete user by first name and last name')
            .where('first_name', firstName)
            .where('last_name', lastName)
            .delete();
    }
    async getAllUsers() {
        // Using custom static function
        return User_1.User.getAllUsers();
    }
    async getUserByFirstName(firstName) {
        return User_1.User.where('first_name', firstName).get();
    }
    async findUser(id) {
        return User_1.User.find(id);
    }
}
exports.UserRepository = UserRepository;
