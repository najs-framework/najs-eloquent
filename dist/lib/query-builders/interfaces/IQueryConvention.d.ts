export interface IQueryConvention {
    formatFieldName(name: string): string;
    getNullValueFor(name: string): any;
}
