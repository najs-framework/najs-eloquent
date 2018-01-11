export declare class Record<T> {
    data: T;
    constructor(data: T & Object);
    static create<T>(data: any): Record<T>;
}
