export declare class KnexTableInfo {
    protected table: string;
    protected database: string;
    constructor(table: string, database?: string);
    getPrimaryKeyName(): string;
    hasPrimaryKey(): boolean;
    getColumns(): object;
    getTableInfo(): Promise<this>;
}
