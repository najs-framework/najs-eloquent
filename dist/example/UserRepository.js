"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./User");
class UserRepository {
    createUser(firstName, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new User_1.User({
                first_name: firstName,
                last_name: lastName
            });
            yield user.save();
            return user;
        });
    }
    updateUser(id, firstName, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.find(id);
            user.first_name = firstName;
            user.last_name = lastName;
            yield user.save();
            return user;
        });
    }
    deleteUser(firstName, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.User.queryName('Delete user by first name and last name')
                .where('first_name', firstName)
                .where('last_name', lastName)
                .delete();
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // Using custom static function
            return User_1.User.getAllUsers();
        });
    }
    getUserByFirstName(firstName) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.User.where('first_name', firstName).get();
        });
    }
    findUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.User.find(id);
        });
    }
}
exports.UserRepository = UserRepository;
