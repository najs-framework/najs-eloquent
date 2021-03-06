export declare class RelationNotDefinedError extends Error {
    static className: string;
    relationName: string;
    model: string;
    constructor(name: string, model: string);
}
