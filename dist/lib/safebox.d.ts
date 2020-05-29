import {JSONSchema4} from "json-schema";
import {ISafeboxMemory} from "./isafebox_memory";
import {PathPermission} from "./permission/path_permission";
import {Path} from "./types";

export declare class Safebox {
  private readonly validator;
  private readonly memoryEngine;

  constructor(schema: JSONSchema4, memoryEngine: ISafeboxMemory, defaultValue?: any);

  getAgent(...permissions: PathPermission[]): SafeboxAgent;

  get(path?: Path): any;

  mutate(path: Path, value: any): void;

  create(path: Path, value: any): void;

  delete(path: Path): void;

  merge(path: Path, value: any): void;

  private throwValidation;
}

export declare class SafeboxAgent {
  private readonly safebox;
  private readonly permit;

  constructor(safebox: Safebox, permissions: PathPermission[]);

  get(path?: Path): any;

  mutate(path: Path, value: any): void;

  create(path: Path, value: any): void;

  delete(path: Path): void;

  merge(path: Path, value: any): void;
}
