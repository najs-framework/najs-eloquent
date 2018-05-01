/// <reference path="../contracts/MongooseProvider.d.ts" />
import { Facade } from 'najs-facade';
import { Mongoose, Model, Schema, Document } from 'mongoose';
export declare class MongooseProvider extends Facade implements Najs.Contracts.Eloquent.MongooseProvider<Mongoose, Schema, Model<Document>> {
    static className: string;
    getClassName(): string;
    getMongooseInstance(): Mongoose;
    createModelFromSchema<T extends Document>(modelName: string, schema: Schema): Model<T>;
}
