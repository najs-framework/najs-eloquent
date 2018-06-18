export declare abstract class QueryBuilderBase {
    static DefaultConvention: NajsEloquent.QueryBuilder.IQueryConvention;
    protected name: string;
    protected logGroup: string;
    protected isUsed: boolean;
    protected primaryKeyName: string;
    protected convention: NajsEloquent.QueryBuilder.IQueryConvention;
    constructor(primaryKeyName?: string);
    abstract orderBy(field: string, direction?: string): this;
    protected getQueryConvention(): NajsEloquent.QueryBuilder.IQueryConvention;
    queryName(name: string): this;
    setLogGroup(group: string): this;
    getPrimaryKeyName(): string;
    orderByAsc(field: string): this;
    orderByDesc(field: string): this;
}
