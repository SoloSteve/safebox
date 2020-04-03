import {ISafeboxMemory} from "../core/isafebox_memory";
import {has} from "lodash";
import {get, set} from "../core/utils/object_access";

export class SafeboxLocalMemory implements ISafeboxMemory {
  private obj: any;

  constructor() {
    this.obj = {};
  }

  doesExist(path: string[]): boolean {
    return has(this.obj, path);
  }

  get(path?: string[]): any {
    if (path !== undefined && path.length !== 0) {
      return get(this.obj, path)
    } else {
      return this.obj;
    }
  }

  set(path: string[], value: any): void {
    if (path !== undefined && path.length !== 0) {
      set(this.obj, path, value);
    } else {
      this.obj = value;
    }
  }

}