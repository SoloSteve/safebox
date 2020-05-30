import {ISafeboxMemory} from "../lib/isafebox_memory";
import {Path} from "../lib/types";
import {get, has, merge, set, unset} from "lodash"

export class LocalMemory implements ISafeboxMemory {
  private object: any;

  constructor() {
    this.object = {};
  }

  create(path: Path, value: any): boolean {
    if (path.length == 0) {
      this.object = value;
      return true;
    }

    if (!this.doesPathExist(path.slice(0, -1)) || this.doesPathExist(path)) return false;

    set(this.object, path, value);
    return true;
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
    merge(this.get(path), value);
    return true;
  }

  mutate(path: Path, value: any): boolean {
    if (!this.doesPathExist(path)) return false;
    set(this.object, path, value);
    return true;
  }

  set(path: Path, value: any): boolean {
    set(this.object, path, value)
    return true;
  }
}