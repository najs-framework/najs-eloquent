"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MESSAGE = 'Cannot load relation :name in a new instance of :model.';
class RelationNotFoundInNewInstanceError extends Error {
    constructor(name, model) {
        super(MESSAGE.replace(':name', name).replace(':model', model));
        Error.captureStackTrace(this, RelationNotFoundInNewInstanceError);
        this.name = RelationNotFoundInNewInstanceError.className;
        this.relationName = name;
        this.model = model;
    }
}
RelationNotFoundInNewInstanceError.className = 'RelationNotFoundInNewInstanceError';
exports.RelationNotFoundInNewInstanceError = RelationNotFoundInNewInstanceError;
