import {JSONSchema4} from "json-schema";
import {ISafeboxMemory} from "./isafebox_memory";
import {PathPermission, PermissionType} from "./permission/path_permission";
import {ObjectError, Path, PermissionDeniedError, ValidationError} from "./types";
import {Permit} from "./permission/permit";
import {Validator} from "./validation/validator";
import {cloneDeep, unset} from "lodash";
import {merge} from "./utils";

export class Safebox {
  private readonly validator: Validator;
  private readonly memoryEngine: ISafeboxMemory

  constructor(schema: JSONSchema4, memoryEngine: ISafeboxMemory, defaultValue?: any) {
    this.validator = new Validator(schema);
    this.memoryEngine = memoryEngine;
    if (defaultValue) this.set([], cloneDeep(defaultValue));
  }

  public getAgent(...permissions: PathPermission[]): SafeboxAgent {
    return new SafeboxAgent(this, permissions);
  }

  public get(path?: Path): any {
    return this.memoryEngine.get(path || []);
  }

  public delete(path: Path): void {
    const value = cloneDeep(this.get(path.slice(0, -1)));
    delete value[path.slice(-1)[0]]
    this.throwValidation(path.slice(0, -1), value);

    if (!this.memoryEngine.delete(path)) {
      throw new ObjectError(path);
    }
  }

  public merge(path: Path, value: any): void {
    this.throwValidation(path, value);

    if (!this.memoryEngine.merge(path, value)) {
      throw new ObjectError(path);
    }
  }

  public set(path: Path, value: any): void {
    this.throwValidation(path, value);

    if (!this.memoryEngine.set(path, value)) {
      throw new ObjectError(path);
    }
  }

  /**
   * Throws error if value isn't valid.
   * @throws ValidationError
   */
  private throwValidation(path: Path, value: any): void {
    const currentValue = cloneDeep(this.get(path));
    const mergedValue = merge(currentValue, value)
    const isValid = this.validator.isValid(path, mergedValue);
    if (!isValid) {
      throw new ValidationError(path, this.validator.errors);
    }
  }

}

export class SafeboxAgent {
  private readonly safebox: Safebox;
  private readonly permit: Permit;

  constructor(safebox: Safebox, permissions: PathPermission[]) {
    this.safebox = safebox;
    this.permit = new Permit(...permissions);
  }

  public get(path?: Path): any {
    let value = this.safebox.get(path);
    const conflicts = this.permit.getConflicts(PermissionType.GET, path || [], value);
    if (conflicts.length != 0) {
      value = cloneDeep(value);
      conflicts.forEach((path) => {
        unset(value, path);
      });
    }

    return value;
  }

  public delete(path: Path): void {
    const conflicts = this.permit.getConflicts(PermissionType.DELETE, path, null);
    if (conflicts.length != 0) {
      throw new PermissionDeniedError(path);
    }
    this.safebox.delete(path);
  }

  public merge(path: Path, value: any): void {
    const conflicts = this.permit.getConflicts(PermissionType.SET, path, value);
    if (conflicts.length != 0) {
      throw new PermissionDeniedError(path);
    }
    this.safebox.merge(path, value);
  }

  public set(path: Path, value: any): void {
    const conflicts = this.permit.getConflicts(PermissionType.SET, path, value);
    if (conflicts.length != 0) {
      throw new PermissionDeniedError(path);
    }
    this.safebox.set(path, value);
  }
}