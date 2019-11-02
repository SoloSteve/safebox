import {set} from "lodash";
import {flatten} from 'flat';
import {Path, PathPermission, PathPermissionType, PermissionRequestType} from "../types";

export default class Permission {
  private static PermissionTypesKey = Symbol();
  private readonly permissionTree: any;

  constructor(permissions: PathPermission[]) {
    this.permissionTree = {};
    permissions.forEach(this.addPermission.bind(this));
  }

  addPermission(permission: PathPermission): void {
    set(
      this.permissionTree,
      permission.path,
      {[Permission.PermissionTypesKey]: permission.pathPermissionTypes}
    );
  }


  hasPermission(path: Path, value: any, permissionType: PermissionRequestType) {
    const innerPaths: Path[] = Object.keys(flatten(value)).map((path) => {
      const parsedPath = [];
      for (let i = 0; i < path.length; i += 2) {
        parsedPath.push(path[i]);
      }
      return parsedPath;
    });

    return innerPaths.every((innerPath) => {
      const permission = this.getFinalPathPermission(path.concat(innerPath));
      switch (permissionType) {
        case PermissionRequestType.READ:
          return permission.has(PathPermissionType.READ);
        case PermissionRequestType.WRITE:
          return permission.has(PathPermissionType.WRITE)
      }
    })
  }

  private getFinalPathPermission(
    path: Path,
    startingNode?: any,
    startingPermissions?: Set<PathPermissionType>
  ): Set<PathPermissionType> {
    let currentPermissions = startingPermissions || new Set<PathPermissionType>();
    let currentSegment = startingNode || this.permissionTree;
    for (let segmentKey of path) {
      if (currentSegment.hasOwnProperty(Permission.PermissionTypesKey)) {
        currentPermissions = new Set([...currentPermissions, ...currentSegment[Permission.PermissionTypesKey]]);
      }

      if (!currentSegment.hasOwnProperty(segmentKey)) break;

      currentSegment = currentSegment[segmentKey];
    }

    return currentPermissions;
  }

}