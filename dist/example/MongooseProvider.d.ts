import { IMongooseProvider } from '../lib';
import { Schema, Document, Model } from 'mongoose';
export declare class MongooseProvider implements IMongooseProvider {
    static className: string;
    getClassName(): string;
    getMongooseInstance(): any;
    createModelFromSchema<T extends Document>(modelName: string, schema: Schema): Model<T>;
}
