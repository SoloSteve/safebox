import {get, isObjectLike, set} from "lodash";
import {flatten} from 'flat';
import {Path, PathAction, PathPermission, PathPermissionSetting} from "../types";

export default class Permission {
  private static PERMISSIONS_KEY = Symbol('PERMISSIONS_KEY');
  private readonly permissionTree: any;

  constructor(permissions: PathPermissionSetting[]) {
    this.permissionTree = {};
    permissions.forEach(this.addPermission.bind(this));
  }

  private static incorporateNewPermissions(newPermissions: Set<PathPermission>, currentPermissions: Set<PathPermission>): Set<PathPermission> {
    if (newPermissions.has(PathPermission.CAN_GET)) currentPermissions.delete(PathPermission.NO_GET);
    if (newPermissions.has(PathPermission.CAN_SET)) currentPermissions.delete(PathPermission.NO_SET);
    return new Set<PathPermission>([...newPermissions, ...currentPermissions]);
  }

  private static canExecuteAction(permissions: Set<PathPermission>, action: PathAction): boolean {
    switch (action) {
      case PathAction.GET:
        return permissions.has(PathPermission.CAN_GET);
      case PathAction.SET:
        return permissions.has(PathPermission.CAN_SET)
    }
  }

  addPermission(permission: PathPermissionSetting): void {
    set(
      this.permissionTree,
      permission.path,
      {[Permission.PERMISSIONS_KEY]: permission.pathPermissionTypes}
    );
  }

  hasPermission(path: Path, value: any, action: PathAction) {
    const basePermission = this.getPermissionsAtPath(path);

    // If the value is an object then there are more paths that we need to check.
    if (isObjectLike(value)) {
      // Get a list of all of the paths inside the "value" object.
      const innerPaths: Path[] = Object.keys(flatten(value)).map((path) => {
        // Create the segmented path by taking all the values in the odd index.
        const segmentedPath = [];
        for (let i = 0; i < path.length; i += 2) {
          segmentedPath.push(path[i]);
        }
        return segmentedPath;
      });

      // We can continue the check from the last node that we went over.
      const basePermissionTreeNode = get(this.permissionTree, path, {});

      // Make sure every one of the paths has has the correct permission.
      return innerPaths.every((innerPath) => {
        const permissions = this.getPermissionsAtPath(innerPath, basePermissionTreeNode, basePermission);
        return Permission.canExecuteAction(permissions, action);
      });
    } else {
      // If the value is not an object then we check simply verify.
      return Permission.canExecuteAction(basePermission, action);
    }
  }

  private getPermissionsAtPath(path: Path, startingLeaf?: any, startingPermissions?: Set<PathPermission>): Set<PathPermission> {
    let currentPermissions = startingPermissions || new Set<PathPermission>();
    let currentLeaf = startingLeaf || this.permissionTree;

    if (currentLeaf.hasOwnProperty(Permission.PERMISSIONS_KEY)) {
      currentPermissions = Permission.incorporateNewPermissions(currentLeaf[Permission.PERMISSIONS_KEY], currentPermissions);
    }

    for (let segmentKey of path) {
      if (!currentLeaf.hasOwnProperty(segmentKey)) break;
      currentLeaf = currentLeaf[segmentKey];

      if (currentLeaf.hasOwnProperty(Permission.PERMISSIONS_KEY)) {
        currentPermissions = Permission.incorporateNewPermissions(currentLeaf[Permission.PERMISSIONS_KEY], currentPermissions);
      }
    }

    return currentPermissions;
  }

}