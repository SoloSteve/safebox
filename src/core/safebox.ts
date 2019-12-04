import ISafeboxMemory from "./isafebox_memory";
import Validation from "./features/validation/validation";
import PermissionChecker from "./features/permission/permission_checker";
import {JSONSchema4} from "json-schema";
import {Access, AccessStatusCode, Path, PathAction, PathPermissionSetting} from "./types";

export default class Safebox {
  private readonly memory: ISafeboxMemory;
  private readonly validation: Validation;
  private readonly permission: PermissionChecker;

  constructor(memory: ISafeboxMemory, options: SafeboxOptions) {
    this.memory = memory;
    this.validation = new Validation(options.schema);
    this.permission = new PermissionChecker(options.permissions || []);
  }

  public get(path?: Path, permission?: PermissionChecker): Access {
    const permissionChecker = permission || this.permission;
    if (!permissionChecker.checkPermission(PathAction.GET,path || [], null).hasPermission) {
      return {status: AccessStatusCode.PERMISSION_DENIED};
    }
    return {value: this.memory.get(path), status: AccessStatusCode.SUCCESS};
  }

  public set(value: any, path: Path, permission?: PermissionChecker): Access {
    const permissionChecker = permission || this.permission;

    // Permission
    if (!permissionChecker.checkPermission(PathAction.SET,path || [], null).hasPermission) {
      return {status: AccessStatusCode.PERMISSION_DENIED};
    }

    // Path Validity
    if (!this.memory.doesExist(path)) {
      return {status: AccessStatusCode.INVALID_PATH};
    }

    // Schema Validation
    let isValid = false;
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

    return {status: AccessStatusCode.SUCCESS};
  }
}

interface SafeboxOptions {
  schema: JSONSchema4,
  permissions?: PathPermissionSetting[]
}