export interface IQueryLogData {
    raw: string;
    result?: any;
    name?: string;
    action?: string;
    queryBuilderData: object;
}
export declare abstract class QueryLogBase<T extends IQueryLogData> {
    protected data: T;
    constructor();
    abstract getDefaultData(): T;
    getEmptyData(): IQueryLogData;
    queryBuilderData(key: string, value: any): this;
    name(name: string): this;
    action(action: string): this;
    raw(raw: any): this;
    raw(...raw: any[]): this;
    end(result: any): any;
}
