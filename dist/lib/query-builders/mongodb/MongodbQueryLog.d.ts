import { IAutoload } from 'najs-binding';
export declare class MongodbQueryLog implements IAutoload {
    static className: string;
    protected data: Object;
    constructor(data: Object);
    getClassName(): string;
    action(action: string): this;
    raw(raw: any): this;
    raw(...raw: any[]): this;
    end(): void;
}
