"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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