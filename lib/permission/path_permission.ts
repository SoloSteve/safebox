import {Path} from "../types";

export class PathPermission {
  public readonly path: Path;
  private readonly permissionTypes: Set<PermissionType>;

  constructor(path: Path, ...permissionTypes: PermissionType[]) {
    this.path = path;
    this.permissionTypes = new Set<PermissionType>(permissionTypes)
  }

  public hasPermission(permissionType: PermissionType): boolean {
    return this.permissionTypes.has(permissionType);
  }
}

export enum PermissionType {
  GET,
  MUTATE,
  CREATE,
  SET,
  DELETE
}