import {ISafeboxMemory} from "../lib/isafebox_memory";
import {Path} from "../lib/types";
import {get, has, unset} from "lodash"
import {merge, set} from "../lib/utils";

export class LocalMemory implements ISafeboxMemory {
  private object: any;

  constructor() {
    this.object = {};
  }

  delete(path: Path): boolean {
    if (!this.doesPathExist(path)) return false;
    return unset(this.object, path);
  }

  doesPathExist(path: Path): boolean {
    if (path.length == 0) return true;
    return has(this.object, path);
  }

  get(path: Path): any {
    if (path.length == 0) return this.object;
    return get(this.object, path);
  }

  merge(path: Path, value: any): boolean {
    if (!this.doesPathExist(path)) return false;
    const currentValue = this.get(path);
    value = merge(currentValue, value);
    this.set(path, value);
    return true;
  }

  set(path: Path, value: any): boolean {
    if (path.length == 0) {
      this.object = value;
      return true;
    }
    set(this.object, path, value)
    return true;
  }
}