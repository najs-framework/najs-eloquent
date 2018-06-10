/// <reference path="../../contracts/MongooseProvider.d.ts" />
import '../../providers/MongooseProvider';
import { IFacade, IFacadeBase } from 'najs-facade';
import { Mongoose, Model, Schema, Document } from 'mongoose';
export interface IMongooseProviderFacade extends Najs.Contracts.Eloquent.MongooseProvider<Mongoose, Schema, Model<Document>> {
}
export declare const MongooseProviderFacade: IMongooseProviderFacade & IFacade;
export declare const MongooseProvider: IMongooseProviderFacade & IFacadeBase;
