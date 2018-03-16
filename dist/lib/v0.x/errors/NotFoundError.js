"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MESSAGE = ':model is not found.';
class NotFoundError extends Error {
    constructor(model) {
        super(MESSAGE.replace(':model', model));
        Error.captureStackTrace(this, NotFoundError);
        this.name = NotFoundError.className;
        this.model = model;
    }
}
NotFoundError.className = 'NotFoundError';
exports.NotFoundError = NotFoundError;
