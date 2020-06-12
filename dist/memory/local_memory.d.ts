import {ISafeboxMemory} from "../lib/isafebox_memory";
import {Path} from "../lib/types";

export declare class LocalMemory implements ISafeboxMemory {
  private object;

  constructor();

  delete(path: Path): boolean;

  doesPathExist(path: Path): boolean;

  get(path: Path): any;

  merge(path: Path, value: any): boolean;

  set(path: Path, value: any): boolean;
}
