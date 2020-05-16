"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectError = exports.PermissionDeniedError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(path, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
        this.name = "ValidationError";
        this.path = path;
    }
}
exports.ValidationError = ValidationError;
class PermissionDeniedError extends Error {
    constructor(path, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PermissionDeniedError);
        }
        this.name = "PermissionDeniedError";
        this.path = path;
    }
}
exports.PermissionDeniedError = PermissionDeniedError;
class ObjectError extends Error {
    constructor(path, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ObjectError);
        }
        this.name = "ObjectError";
        this.path = path;
    }
}
exports.ObjectError = ObjectError;
//# sourceMappingURL=types.js.map