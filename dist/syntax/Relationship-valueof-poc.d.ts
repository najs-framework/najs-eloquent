declare class HasManyRelationship {
    value: any;
    constructor(value?: any);
    getValue(): string;
}
declare const SmartProxy: {
    get: (target: any, key: any) => any;
    set: (target: any, key: any, value: any) => any;
};
declare class PostModel {
    comments: any;
    loaded: Object;
    constructor();
    hasMany(): HasManyRelationship;
    setLoaded(relationship: string): void;
}
declare const notLoaded: PostModel;
declare const loaded: PostModel;
