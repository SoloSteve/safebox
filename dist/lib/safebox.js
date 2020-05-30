"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeboxAgent = exports.Safebox = void 0;
const path_permission_1 = require("./permission/path_permission");
const types_1 = require("./types");
const permit_1 = require("./permission/permit");
const validator_1 = require("./validation/validator");
const lodash_1 = require("lodash");
class Safebox {
  constructor(schema, memoryEngine, defaultValue) {
    this.validator = new validator_1.Validator(schema);
    this.memoryEngine = memoryEngine;
    if (defaultValue)
      this.create([], defaultValue);
  }

  getAgent(...permissions) {
    return new SafeboxAgent(this, permissions);
  }

  get(path) {
    return this.memoryEngine.get(path || []);
  }

  mutate(path, value) {
    path = path || [];
    this.throwValidation(path, value);
    if (!this.memoryEngine.mutate(path, value)) {
      throw new types_1.ObjectError(path);
    }
  }

  create(path, value) {
    path = path || [];
    this.throwValidation(path, value);
    if (!this.memoryEngine.create(path, value)) {
      throw new types_1.ObjectError(path);
    }
  }

  delete(path) {
    path = path || [];
    const value = lodash_1.cloneDeep(this.get(path.slice(0, -1)));
    delete value[path.slice(-1)[0]];
    this.throwValidation(path.slice(0, -1), value);
    if (!this.memoryEngine.delete(path)) {
      throw new types_1.ObjectError(path);
    }
  }

  merge(path, value) {
    path = path || [];
    this.throwValidation(path, value);
    if (!this.memoryEngine.merge(path, value)) {
      throw new types_1.ObjectError(path);
    }
  }

  throwValidation(path, value) {
    const isValid = this.validator.isValid(path, value);
    if (!isValid) {
      throw new types_1.ValidationError(path);
    }
  }
}
exports.Safebox = Safebox;
class SafeboxAgent {
    constructor(safebox, permissions) {
        this.safebox = safebox;
        this.permit = new permit_1.Permit(...permissions);
    }
    get(path) {
      let value = this.safebox.get(path);
      const conflicts = this.permit.getConflicts(path_permission_1.PermissionType.GET, path || [], value);
      if (conflicts.length != 0) {
        value = lodash_1.cloneDeep(value);
        conflicts.forEach((path) => {
          lodash_1.unset(value, path);
        });
      }
      return value;
    }

  mutate(path, value) {
    const conflicts = this.permit.getConflicts(path_permission_1.PermissionType.MUTATE, path, value);
    if (conflicts.length != 0) {
      throw new types_1.PermissionDeniedError(path);
    }
    this.safebox.mutate(path, value);
  }

  create(path, value) {
    const conflicts = this.permit.getConflicts(path_permission_1.PermissionType.CREATE, path, value);
    if (conflicts.length != 0) {
      throw new types_1.PermissionDeniedError(path);
    }
    this.safebox.create(path, value);
  }

  delete(path) {
    const conflicts = this.permit.getConflicts(path_permission_1.PermissionType.CREATE, path, null);
    if (conflicts.length != 0) {
      throw new types_1.PermissionDeniedError(path);
    }
    this.safebox.delete(path);
  }

  merge(path, value) {
    const conflicts = this.permit.getConflicts(path_permission_1.PermissionType.MUTATE, path, value);
    if (conflicts.length != 0) {
      throw new types_1.PermissionDeniedError(path);
    }
    this.safebox.merge(path, value);
  }
}
exports.SafeboxAgent = SafeboxAgent;
//# sourceMappingURL=safebox.js.map