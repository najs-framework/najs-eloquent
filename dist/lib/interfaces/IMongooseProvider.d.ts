import { Mongoose } from 'mongoose';
import { IAutoload } from 'najs';
export interface IMongooseProvider extends IAutoload {
    getMongooseInstance(): Mongoose;
}
