import {Path} from "./types";

export interface ISafeboxMemory {
  mutate(path: Path, value: any): boolean;

  create(path: Path, value: any): boolean;

  delete(path: Path): boolean;

  merge(path: Path, value: any): boolean;

  get(path: Path): any;

  doesPathExist(path: Path): boolean;
}
