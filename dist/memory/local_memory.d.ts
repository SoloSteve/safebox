import {ISafeboxMemory} from "../lib/isafebox_memory";
import {Path} from "../lib/types";

export declare class LocalMemory implements ISafeboxMemory {
  private object;

  constructor();

  create(path: Path, value: any): boolean;

  delete(path: Path): boolean;

  doesPathExist(path: Path): boolean;

  get(path: Path): any;

  merge(path: Path, value: any): boolean;

  mutate(path: Path, value: any): boolean;
}
