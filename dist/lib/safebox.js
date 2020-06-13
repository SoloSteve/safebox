"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeboxAgent = exports.Safebox = void 0;
const path_permission_1 = require("./permission/path_permission");
const types_1 = require("./types");
const permit_1 = require("./permission/permit");
const validator_1 = require("./validation/validator");
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
class Safebox {
  constructor(schema, memoryEngine, defaultValue) {
    this.validator = new validator_1.Validator(schema);
    this.memoryEngine = memoryEngine;
    if (defaultValue)
      this.set([], defaultValue);
  }

  getAgent(...permissions) {
    return new SafeboxAgent(this, permissions);
  }

  get(path) {
    return this.memoryEngine.get(path || []);
  }

  delete(path) {
    const value = lodash_1.cloneDeep(this.get(path.slice(0, -1)));
    delete value[path.slice(-1)[0]];
    this.throwValidation(path.slice(0, -1), value);
    if (!this.memoryEngine.delete(path)) {
      throw new types_1.ObjectError(path);
    }
  }

  merge(path, value) {
    this.throwValidation(path, value);
    if (!this.memoryEngine.merge(path, value)) {
      throw new types_1.ObjectError(path);
    }
  }

  set(path, value) {
    this.throwValidation(path, value);
    if (!this.memoryEngine.set(path, value)) {
      throw new types_1.ObjectError(path);
    }
  }

  throwValidation(path, value) {
    const currentValue = lodash_1.cloneDeep(this.get(path));
    const mergedValue = utils_1.merge(currentValue, value);
    const isValid = this.validator.isValid(path, mergedValue);
    if (!isValid) {
      throw new types_1.ValidationError(path, this.validator.errors);
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

  delete(path) {
    const conflicts = this.permit.getConflicts(path_permission_1.PermissionType.DELETE, path, null);
    if (conflicts.length != 0) {
      throw new types_1.PermissionDeniedError(path);
    }
    this.safebox.delete(path);
  }

  merge(path, value) {
    const conflicts = this.permit.getConflicts(path_permission_1.PermissionType.SET, path, value);
    if (conflicts.length != 0) {
      throw new types_1.PermissionDeniedError(path);
    }
    this.safebox.merge(path, value);
  }

  set(path, value) {
    const conflicts = this.permit.getConflicts(path_permission_1.PermissionType.SET, path, value);
    if (conflicts.length != 0) {
      throw new types_1.PermissionDeniedError(path);
    }
    this.safebox.set(path, value);
  }
}
exports.SafeboxAgent = SafeboxAgent;
//# sourceMappingURL=safebox.js.map