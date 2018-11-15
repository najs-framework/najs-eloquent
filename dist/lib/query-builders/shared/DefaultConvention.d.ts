/// <reference path="../../definitions/query-builders/IConvention.d.ts" />
export declare class DefaultConvention implements NajsEloquent.QueryBuilder.IConvention {
    formatFieldName(name: any): any;
    getNullValueFor(name: any): null;
}
