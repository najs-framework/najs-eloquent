import { Mongoose, Model, Schema, Document } from 'mongoose';
import { IAutoload } from 'najs';
export interface IMongooseProvider extends IAutoload {
    getMongooseInstance(): Mongoose;
    createModelFromSchema<T extends Document>(modelName: string, schema: Schema): Model<T>;
}
