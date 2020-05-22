export declare type Path = string[];

export declare class BaseSafeboxError extends Error {
  readonly isSafeboxError: boolean;
}

export declare class ValidationError extends BaseSafeboxError {
  readonly path: Path;

  constructor(path: Path, ...params: any);
}

export declare class PermissionDeniedError extends BaseSafeboxError {
  readonly path: Path;

  constructor(path: Path, ...params: any);
}

export declare class ObjectError extends BaseSafeboxError {
  readonly path: Path;

  constructor(path: Path, ...params: any);
}
