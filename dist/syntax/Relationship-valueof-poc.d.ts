declare class HasManyRelationship {
    value: any;
    constructor(value?: any);
    getValue(): string;
}
declare const SmartProxy: {
    get: (target: any, key: any) => any;
    set: (target: any, key: any, value: any) => any;
};
interface IComment {
    test: string;
    getValue(): any;
}
declare class PostModel {
    comments: IComment;
    loaded: Object;
    constructor();
    hasMany(): any;
    setLoaded(relationship: string): void;
    getComments(): any;
}
declare const notLoaded: PostModel;
declare const loaded: PostModel;
