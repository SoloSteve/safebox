import {ISafeboxMemory} from "./isafebox_memory";
import {Validation} from "./features/validation/validation";
import {PermissionChecker} from "./features/permission/permission_checker";
import {JSONSchema4} from "json-schema";
import {Access, AccessStatusCode, Path, PathAction, PathPermissionSetting} from "./types";
import {unset} from "lodash";

export class Safebox {
  private readonly memory: ISafeboxMemory;
  private readonly validation: Validation;
  private readonly permission: PermissionChecker;

  constructor(memory: ISafeboxMemory, options: SafeboxOptions) {
    this.memory = memory;
    this.validation = new Validation(options.schema);
    this.permission = new PermissionChecker(options.permissions || []);
  }

  public addPermissions(...permissions: PathPermissionSetting[]) {
    permissions.forEach(this.permission.addPermission);
  }

  public get(path?: Path, partial: boolean = false, permission?: PermissionChecker): Access {
    const permissionChecker = permission || this.permission;

    // Path Validity
    if (path !== undefined && !this.memory.doesExist(path)) {
      return {status: AccessStatusCode.INVALID_PATH};
    }

    // Permission
    const permissionResult = permissionChecker.checkPermission(PathAction.GET, path || []);

    // Check whether partial is allowed.
    if (!partial && !permissionResult.hasPermission) {
      return {status: AccessStatusCode.PERMISSION_DENIED};
    }

    // Remove problematic paths.
    const value = this.memory.get(path);
    permissionResult.problems.forEach((problemPath) => {
      unset(value, problemPath);
    });

    return {value, status: AccessStatusCode.SUCCESS};
  }

  public set(value: any, path?: Path, permission?: PermissionChecker): Access {
    const permissionChecker = permission || this.permission;

    // Permission
    if (!permissionChecker.checkPermission(PathAction.SET, path || [], null).hasPermission) {
      return {status: AccessStatusCode.PERMISSION_DENIED};
    }

    // Path Validity
    if (path !== undefined && !this.memory.doesExist(path)) {
      return {status: AccessStatusCode.INVALID_PATH};
    }

    path = path || [];

    // Schema Validation
    let isValid: boolean;
    if (this.validation.hasFastValidation) {
      isValid = this.validation.isValid(path, value);
    } else {
      const previousPathValue = this.memory.get(path);
      this.memory.set(path, value);
      isValid = this.validation.isBoxValid(this.memory.get());
      if (!isValid) {
        this.memory.set(path, previousPathValue); // Undo Set
        return {status: AccessStatusCode.INVALID_VALUE};
      }
    }

    if (!isValid) {
      return {status: AccessStatusCode.INVALID_VALUE};
    }

    this.memory.set(path, value);

    return {status: AccessStatusCode.SUCCESS};
  }
}

interface SafeboxOptions {
  schema: JSONSchema4,
  permissions?: PathPermissionSetting[]
}