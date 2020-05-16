"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
class Permission {
    constructor(...allowedActions) {
        this.allowedActions = new Set(allowedActions);
    }
    canExecuteAction(action) {
        return this.allowedActions.has(action);
    }
}
exports.Permission = Permission;
//# sourceMappingURL=permission.js.map