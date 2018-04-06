export interface IHelperQuery<T> {
    find(id: any): Promise<T | null>;
    first(id: any): Promise<T | null>;
    findById(id: any): Promise<T | null>;
    findOrFail(id: any): Promise<T>;
    firstOrFail(id: any): Promise<T>;
}
