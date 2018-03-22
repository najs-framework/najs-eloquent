import { Facade } from 'najs-facade';
import { IMongooseProvider } from './interfaces/IMongooseProvider';
import { Mongoose, Model, Schema, Document } from 'mongoose';
export declare class BuiltinMongooseProvider extends Facade implements IMongooseProvider {
    static className: string;
    getClassName(): string;
    getMongooseInstance(): Mongoose;
    createModelFromSchema<T extends Document>(modelName: string, schema: Schema): Model<T>;
}
