"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MESSAGE = 'Relation :name is not defined in model :model.';
class RelationNotDefinedError extends Error {
    constructor(name, model) {
        super(MESSAGE.replace(':name', name).replace(':model', model));
        Error.captureStackTrace(this, RelationNotDefinedError);
        this.name = RelationNotDefinedError.className;
        this.relationName = name;
        this.model = model;
    }
}
RelationNotDefinedError.className = 'NotFoundError';
exports.RelationNotDefinedError = RelationNotDefinedError;
