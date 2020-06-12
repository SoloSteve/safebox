import {Path} from "../types";

export declare class PathPermission {
  readonly path: Path;
  private readonly permissionTypes;

  constructor(path: Path, ...permissionTypes: PermissionType[]);

  hasPermission(permissionType: PermissionType): boolean;
}

export declare enum PermissionType {
  GET = 0,
  SET = 1,
  DELETE = 2
}
