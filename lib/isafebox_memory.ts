import {Path} from "./types";

export interface ISafeboxMemory {

  delete(path: Path): boolean;

  merge(path: Path, value: any): boolean;

  get(path: Path): any;

  set(path: Path, value: any): boolean;

  doesPathExist(path: Path): boolean;
}