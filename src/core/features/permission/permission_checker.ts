import {get, isObjectLike, set} from "lodash";
import {flatten} from 'flat';
import {Path, PathAction, PathPermissionSetting} from "../../types";
import Permission from "./Permission";

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
    let hasPermission = false;
    const problems = [];
    const basePermission = this.getPermissionForPath(path);

    // If the value is an object then there are more paths that we need to check.
    if (isObjectLike(value)) {
      // Get a list of all of the paths inside the "value" object.
      const innerPaths: Path[] = Object.keys(flatten(value)).map((path) => {
        // Create the segmented path from the string by taking all the values in the odd index.
        const segmentedPath = [];
        for (let i = 0; i < path.length; i += 2) {
          segmentedPath.push(path[i]);
        }
        return segmentedPath;
      });

      // We can continue the check from the last node that we went over.
      const basePermissionTreeNode = get(this.permissionTree, path, {});

      // Make sure every one of the inner paths has has the correct permission.
      hasPermission = innerPaths.every((innerPath) => {
        this.getPermissionForPath(innerPath, basePermissionTreeNode, basePermission).canExecuteAction(action);
      });
      if (hasPermission) {
        problems.push(...PermissionChecker.findContradictingPermissions(action, basePermissionTreeNode, path));
      }
    } else {
      // If the value is not an object then we simply verify.
      hasPermission = basePermission.canExecuteAction(action);
      if (hasPermission) {
        const basePermissionTreeNode = get(this.permissionTree, path, {});
        problems.push(...PermissionChecker.findContradictingPermissions(action, basePermissionTreeNode, path));
      }
    }

    return {hasPermission, problems}

  }

  private static findContradictingPermissions(action: PathAction, startingLeaf: any, currentPath: Path): Path[] {
    const paths: Path[] = [];
    if (
      startingLeaf.hasOwnProperty(PermissionChecker.PERMISSIONS_KEY)
      && !startingLeaf[PermissionChecker.PERMISSIONS_KEY].canExecuteAction(action)
    ) {
      return [currentPath];
    } else {
      Object.entries(startingLeaf).forEach(([key, leaf]) => {
        currentPath.push(key);
        paths.push(...this.findContradictingPermissions(action, leaf, currentPath));
      });
      return paths;
    }
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