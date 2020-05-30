"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionType = exports.PathPermission = void 0;
class PathPermission {
    constructor(path, ...permissionTypes) {
        this.path = path;
        this.permissionTypes = new Set(permissionTypes);
    }
    hasPermission(permissionType) {
        return this.permissionTypes.has(permissionType);
    }
}
exports.PathPermission = PathPermission;
var PermissionType;
(function (PermissionType) {
  PermissionType[PermissionType["GET"] = 0] = "GET";
  PermissionType[PermissionType["MUTATE"] = 1] = "MUTATE";
  PermissionType[PermissionType["CREATE"] = 2] = "CREATE";
  PermissionType[PermissionType["SET"] = 3] = "SET";
  PermissionType[PermissionType["DELETE"] = 4] = "DELETE";
})(PermissionType = exports.PermissionType || (exports.PermissionType = {}));
//# sourceMappingURL=path_permission.js.map