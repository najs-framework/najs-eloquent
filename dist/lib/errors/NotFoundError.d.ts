export declare class NotFoundError extends Error {
    static className: string;
    model: string;
    constructor(model: string);
}
