"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const object_access_1 = require("../../utils/object_access");
const permission_1 = require("./permission");
const traverse = require("traverse");
class PermissionChecker {
    constructor(permissions) {
        this.permissionTree = {};
        permissions.forEach(this.addPermission.bind(this));
    }
    addPermission(permission) {
        if (permission.path.length === 0) {
            this.permissionTree[PermissionChecker.PERMISSIONS_KEY] = permission.permissions;
        }
        else {
            object_access_1.set(this.permissionTree, permission.path, { [PermissionChecker.PERMISSIONS_KEY]: permission.permissions });
        }
    }
    checkPermission(action, path, value) {
        let hasPermission;
        const problems = [];
        const basePermission = this.getPermissionForPath(path);
        if (lodash_1.isObjectLike(value)) {
            const innerPaths = [];
            traverse(value).forEach(function () {
                if (this.isLeaf)
                    innerPaths.push(path.concat(this.path));
            });
            const basePermissionTreeNode = object_access_1.get(this.permissionTree, path, {});
            hasPermission = innerPaths.every((innerPath) => {
                let innerPathHasPermission = this.getPermissionForPath(innerPath, basePermissionTreeNode, basePermission).canExecuteAction(action);
                if (innerPathHasPermission) {
                    problems.push(...this.findContradictingPermissions(action, innerPath));
                    if (problems.length > 0) {
                        innerPathHasPermission = false;
                    }
                }
                else {
                    problems.push(innerPath);
                }
                return innerPathHasPermission;
            });
        }
        else {
            hasPermission = basePermission.canExecuteAction(action);
        }
        problems.push(...this.findContradictingPermissions(action, path));
        if (problems.length > 0) {
            hasPermission = false;
        }
        return { hasPermission, problems: lodash_1.uniqWith(problems, lodash_1.isEqual) };
    }
    findContradictingPermissions(action, startingPath) {
        const pathsToCheck = [startingPath];
        const problematicPaths = [];
        while (pathsToCheck.length > 0) {
            const pathToCheck = pathsToCheck.shift();
            const objectAtPath = object_access_1.get(this.permissionTree, pathToCheck, {});
            if (objectAtPath.hasOwnProperty(PermissionChecker.PERMISSIONS_KEY)
                && !objectAtPath[PermissionChecker.PERMISSIONS_KEY].canExecuteAction(action)) {
                problematicPaths.push(pathToCheck);
            }
            else {
                pathsToCheck.push(...Object.keys(objectAtPath).map((key) => pathToCheck.concat(key)));
            }
        }
        return problematicPaths;
    }
    getPermissionForPath(path, startingLeaf, startingPermission) {
        let currentLeaf = startingLeaf || this.permissionTree;
        let currentPermission = currentLeaf[PermissionChecker.PERMISSIONS_KEY]
            || startingPermission
            || new permission_1.Permission();
        for (let segmentKey of path) {
            if (!currentLeaf.hasOwnProperty(segmentKey))
                break;
            currentLeaf = currentLeaf[segmentKey];
            if (currentLeaf.hasOwnProperty(PermissionChecker.PERMISSIONS_KEY)) {
                currentPermission = currentLeaf[PermissionChecker.PERMISSIONS_KEY];
            }
        }
        return currentPermission;
    }
}
exports.PermissionChecker = PermissionChecker;
PermissionChecker.PERMISSIONS_KEY = Symbol('PERMISSIONS_KEY');
//# sourceMappingURL=permission_checker.js.map