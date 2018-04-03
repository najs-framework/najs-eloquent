export interface BasicQuery {
    where(): this;
}
export interface FetchResult<T> {
    first(): this & T;
}
export interface Model<Props> extends BasicQuery, FetchResult<Props> {
    id: string;
    getId(): string;
}
export declare type MongooseStatic<T, C> = {
    new (): Model<T> & T;
    where(): BasicQuery & FetchResult<Model<T> & T & C>;
    first(): Model<T> & T & C;
};
export declare type IEloquent<T> = {
    new (): Model<T> & T;
    Mongoose<T, C>(): MongooseStatic<T, C>;
};
export declare const Eloquent: IEloquent<{}>;
export interface Mongoose<T> extends IEloquent<T> {
}
export interface IUser {
    first_name: string;
    last_name: string;
}
export declare class UserOne extends Eloquent implements IUser {
    first_name: string;
    last_name: string;
    doSomething(...args: any[]): void;
    static doesSomething(...args: any[]): void;
}
declare const UserTwo_base: MongooseStatic<IUser, UserTwo>;
export declare class UserTwo extends UserTwo_base {
    doSomething(...args: any[]): void;
    static doesSomething(...args: any[]): void;
}
declare const UserThree_base: Mongoose<IUser>;
export declare class UserThree extends UserThree_base {
    doSomething(...args: any[]): void;
    static doesSomething(...args: any[]): void;
}
