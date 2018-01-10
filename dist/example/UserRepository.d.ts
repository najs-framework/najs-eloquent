import { User } from './User';
import { Collection } from 'collect.js';
export declare class UserRepository {
    createUser(firstName: string, lastName: string): Promise<User>;
    updateUser(id: string, firstName: string, lastName: string): Promise<User>;
    deleteUser(firstName: string, lastName: string): Promise<any>;
    getAllUsers(): Promise<Collection<User>>;
    getUserByFirstName(firstName: string): Promise<Collection<User>>;
    findUser(id: string): Promise<User | undefined>;
}
