import {PathPermission, PermissionType} from "./path_permission";
import {set} from "../utils";
import {Path} from "../types";
import traverse = require("traverse");


export class Permit {
  private static readonly PERMISSIONS_KEY: string = Symbol("PERMISSIONS_KEY") as any;
  private readonly permissionTree: PermissionTree;


  constructor(...permissions: PathPermission[]) {
    this.permissionTree = {};
    this.addPermissions(...permissions);
  }

  public addPermissions(...permissions: PathPermission[]) {
    permissions.forEach((permission) => {
      set(this.permissionTree, [...permission.path, Permit.PERMISSIONS_KEY], permission);
    })
  }

  public getConflicts(permissionType: PermissionType, path: Path, valueAtPath: any): Path[] {
    const leafPaths = this.getLeafPaths(valueAtPath, path);
    return leafPaths.filter((leafPath) => {
      return !this.getPermissionForPath(leafPath)?.hasPermission(permissionType);
    });
  }

  private getLeafPaths(obj: any, basePath: Path = []): Path[] {
    const innerPaths: Path[] = [];
    traverse(obj).forEach(function () {
      if (this.isLeaf) innerPaths.push(basePath.concat(this.path));
    });

    return innerPaths;
  }

  private getPermissionForPath(path: Path): PathPermission | null {
    let currentPermissionTree = this.permissionTree;
    let currentPermission: PathPermission | null = null;

    if (this.permissionTree.hasOwnProperty(Permit.PERMISSIONS_KEY)) {
      currentPermission = this.permissionTree[Permit.PERMISSIONS_KEY] as PathPermission;
    }

    for (let pathSegment of path) {
      if (!currentPermissionTree.hasOwnProperty(pathSegment)) break;

      currentPermissionTree = currentPermissionTree[pathSegment] as PermissionTree;

      if (currentPermissionTree.hasOwnProperty(Permit.PERMISSIONS_KEY)) {
        currentPermission = currentPermissionTree[Permit.PERMISSIONS_KEY] as PathPermission;
      }
    }

    return currentPermission;
  }

}

type PermissionTree = { [key: string]: PermissionTree | PathPermission };