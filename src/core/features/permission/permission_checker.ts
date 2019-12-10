import {get, isObjectLike, isEqual, set, uniqWith} from "lodash";
import traverse = require("traverse");
import {Path, PathAction, PathPermissionSetting} from "../../types";
import Permission from "./permission";

export default class PermissionChecker {
  private static PERMISSIONS_KEY = Symbol('PERMISSIONS_KEY');
  private readonly permissionTree: any;

  constructor(permissions: PathPermissionSetting[]) {
    this.permissionTree = {};
    permissions.forEach(this.addPermission.bind(this));
  }

  public addPermission(permission: PathPermissionSetting): void {
    if (permission.path.length === 0) {
      this.permissionTree[PermissionChecker.PERMISSIONS_KEY] = permission.permissions;
    } else {
      set(
        this.permissionTree,
        permission.path,
        {[PermissionChecker.PERMISSIONS_KEY]: permission.permissions}
      );
    }
  }

  public checkPermission(action: PathAction, path: Path, value?: any): { hasPermission: boolean, problems: Path[] } {
    let hasPermission;
    const problems = [];
    const basePermission = this.getPermissionForPath(path);

    // If the value is an object then there are more paths that we need to check.
    if (isObjectLike(value)) {
      // Get a list of all of the paths inside the "value" object.
      const innerPaths: Path[] = [];
      traverse(value).forEach(function () {
        if (this.isLeaf) innerPaths.push(path.concat(this.path));
      });

      // We can continue the check from the last node that we went over.
      const basePermissionTreeNode = get(this.permissionTree, path, {});

      // Make sure every one of the inner paths has has the correct permission.
      hasPermission = innerPaths.every((innerPath) => {
        let innerPathHasPermission = this.getPermissionForPath(innerPath, basePermissionTreeNode, basePermission).canExecuteAction(action);
        if (innerPathHasPermission) {
          problems.push(...this.findContradictingPermissions(action, innerPath));
          if (problems.length > 0) {
            innerPathHasPermission = false;
          }
        } else {
          problems.push(innerPath);
        }
        return innerPathHasPermission;
      });
    } else {
      // If the value is not an object then we simply verify.
      hasPermission = basePermission.canExecuteAction(action);
    }

    problems.push(...this.findContradictingPermissions(action, path));
    if (problems.length > 0) {
      hasPermission = false;
    }

    return {hasPermission, problems: uniqWith(problems, isEqual)}

  }

  private findContradictingPermissions(action: PathAction, startingPath: Path): Path[] {
    const pathsToCheck: Path[] = [startingPath];
    const problematicPaths: Path[] = [];

    while (pathsToCheck.length > 0) {
      const pathToCheck = pathsToCheck.shift() as Path;
      const objectAtPath = get(this.permissionTree, pathToCheck, {});

      if (
        objectAtPath.hasOwnProperty(PermissionChecker.PERMISSIONS_KEY)
        && !objectAtPath[PermissionChecker.PERMISSIONS_KEY].canExecuteAction(action)
      ) {
        problematicPaths.push(pathToCheck);
      } else {
        pathsToCheck.push(...Object.keys(objectAtPath).map((key) => pathToCheck.concat(key)));
      }
    }

    return problematicPaths;
  }

  private getPermissionForPath(path: Path, startingLeaf?: any, startingPermission?: Permission) {
    let currentLeaf = startingLeaf || this.permissionTree;
    let currentPermission: Permission =
      currentLeaf[PermissionChecker.PERMISSIONS_KEY]
      || startingPermission
      || new Permission();

    for (let segmentKey of path) {
      if (!currentLeaf.hasOwnProperty(segmentKey)) break;
      currentLeaf = currentLeaf[segmentKey];

      if (currentLeaf.hasOwnProperty(PermissionChecker.PERMISSIONS_KEY)) {
        currentPermission = currentLeaf[PermissionChecker.PERMISSIONS_KEY];
      }
    }

    return currentPermission;
  }
}