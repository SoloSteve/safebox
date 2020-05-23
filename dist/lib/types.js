"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.ObjectError = exports.PermissionDeniedError = exports.ValidationError = exports.BaseSafeboxError = void 0;

class BaseSafeboxError extends Error {
  constructor() {
    super(...arguments);
    this.isSafeboxError = true;
  }
}
exports.BaseSafeboxError = BaseSafeboxError;

class ValidationError extends BaseSafeboxError {
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

class PermissionDeniedError extends BaseSafeboxError {
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

class ObjectError extends BaseSafeboxError {
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