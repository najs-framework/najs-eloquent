/// <reference path="../../contracts/MongodbProvider.d.ts" />
import '../../providers/MongodbProvider';
import { IFacade, IFacadeBase } from 'najs-facade';
import { MongoClient, Db } from 'mongodb';
export interface IMongodbProviderFacade extends Najs.Contracts.Eloquent.MongodbProvider<MongoClient, Db> {
}
export declare const MongodbProviderFacade: IMongodbProviderFacade & IFacade;
export declare const MongodbProvider: IMongodbProviderFacade & IFacadeBase;
