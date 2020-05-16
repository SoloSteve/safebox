"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permit = void 0;
const path_utils_1 = require("../path_utils");
const traverse = require("traverse");
let Permit = (() => {
    class Permit {
        constructor(...permissions) {
            this.permissionTree = {};
            this.addPermissions(...permissions);
        }
        addPermissions(...permissions) {
            permissions.forEach((permission) => {
                path_utils_1.set(this.permissionTree, permission.path, { [Permit.PERMISSIONS_KEY]: permission });
            });
        }
        getConflicts(permissionType, path, valueAtPath) {
            const leafPaths = this.getLeafPaths(valueAtPath, path);
            return leafPaths.filter((leafPath) => {
                var _a;
                return !((_a = this.getPermissionForPath(leafPath)) === null || _a === void 0 ? void 0 : _a.hasPermission(permissionType));
            });
        }
        getLeafPaths(obj, basePath = []) {
            const innerPaths = [];
            traverse(obj).forEach(function () {
                if (this.isLeaf)
                    innerPaths.push(basePath.concat(this.path));
            });
            return innerPaths;
        }
        getPermissionForPath(path) {
            let currentPermissionTree = this.permissionTree;
            let currentPermission = null;
            if (this.permissionTree.hasOwnProperty(Permit.PERMISSIONS_KEY)) {
                currentPermission = this.permissionTree[Permit.PERMISSIONS_KEY];
            }
            for (let pathSegment of path) {
                if (!currentPermissionTree.hasOwnProperty(pathSegment))
                    break;
                currentPermissionTree = currentPermissionTree[pathSegment];
                if (currentPermissionTree.hasOwnProperty(Permit.PERMISSIONS_KEY)) {
                    currentPermission = currentPermissionTree[Permit.PERMISSIONS_KEY];
                }
            }
            return currentPermission;
        }
    }
    Permit.PERMISSIONS_KEY = Symbol("PERMISSIONS_KEY");
    return Permit;
})();
exports.Permit = Permit;
//# sourceMappingURL=permit.js.map