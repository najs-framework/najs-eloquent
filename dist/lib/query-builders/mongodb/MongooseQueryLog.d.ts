import { MongooseQueryBuilder } from './MongooseQueryBuilder';
export declare class MongooseQueryLog {
    protected data: Object;
    protected constructor(data: Object);
    action(action: string): this;
    raw(raw: any): this;
    raw(...raw: any[]): this;
    end(): void;
    static create(queryBuilder: MongooseQueryBuilder): MongooseQueryLog;
}
