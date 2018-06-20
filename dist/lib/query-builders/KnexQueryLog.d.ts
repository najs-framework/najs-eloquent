import { KnexQueryBuilder } from './KnexQueryBuilder';
export declare class KnexQueryLog implements Najs.Contracts.Autoload {
    protected data: object;
    constructor(data?: object);
    getClassName(): string;
    name(name: string): this;
    sql(sql: string): this;
    end(): void;
    log(queryBuilder: KnexQueryBuilder): void;
}
