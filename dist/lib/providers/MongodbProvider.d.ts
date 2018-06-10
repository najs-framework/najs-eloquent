/// <reference path="../contracts/MongodbProvider.d.ts" />
import { Facade } from 'najs-facade';
import { Db, MongoClient } from 'mongodb';
export declare class MongodbProvider extends Facade implements Najs.Contracts.Eloquent.MongodbProvider<MongoClient, Db> {
    mongoClient: MongoClient;
    getClassName(): string;
    connect(url: string): Promise<this>;
    close(): this;
    getMongoClient(): MongoClient;
    getDatabase(dbName?: string): Db;
}
