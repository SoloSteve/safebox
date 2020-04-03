"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./features/validation/validation");
const permission_checker_1 = require("./features/permission/permission_checker");
const types_1 = require("./types");
const lodash_1 = require("lodash");
class Safebox {
    constructor(memory, options) {
        this.memory = memory;
        this.validation = new validation_1.Validation(options.schema);
        this.permission = new permission_checker_1.PermissionChecker(options.permissions || []);
    }
    get(path, partial = false, permission) {
        const permissionChecker = permission || this.permission;
        if (path !== undefined && !this.memory.doesExist(path)) {
            return { status: types_1.AccessStatusCode.INVALID_PATH };
        }
        const permissionResult = permissionChecker.checkPermission(types_1.PathAction.GET, path || []);
        if (!partial && !permissionResult.hasPermission) {
            return { status: types_1.AccessStatusCode.PERMISSION_DENIED };
        }
        const value = this.memory.get(path);
        permissionResult.problems.forEach((problemPath) => {
            lodash_1.unset(value, problemPath);
        });
        return { value, status: types_1.AccessStatusCode.SUCCESS };
    }
    set(value, path, permission) {
        const permissionChecker = permission || this.permission;
        if (!permissionChecker.checkPermission(types_1.PathAction.SET, path || [], null).hasPermission) {
            return { status: types_1.AccessStatusCode.PERMISSION_DENIED };
        }
        if (path !== undefined && !this.memory.doesExist(path)) {
            return { status: types_1.AccessStatusCode.INVALID_PATH };
        }
        path = path || [];
        let isValid;
        if (this.validation.hasFastValidation) {
            isValid = this.validation.isValid(path, value);
        }
        else {
            const previousPathValue = this.memory.get(path);
            this.memory.set(path, value);
            isValid = this.validation.isBoxValid(this.memory.get());
            if (!isValid) {
                this.memory.set(path, previousPathValue);
                return { status: types_1.AccessStatusCode.INVALID_VALUE };
            }
        }
        if (!isValid) {
            return { status: types_1.AccessStatusCode.INVALID_VALUE };
        }
        this.memory.set(path, value);
        return { status: types_1.AccessStatusCode.SUCCESS };
    }
}
exports.Safebox = Safebox;
//# sourceMappingURL=safebox.js.map