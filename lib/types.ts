export type Path = string[];

export class BaseSafeboxError extends Error {
  public readonly isSafeboxError: boolean = true;
}

export class ValidationError extends BaseSafeboxError {
  public readonly path: Path;
  public readonly errors: any;

  constructor(path: Path, errors: any, ...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }

    this.name = "ValidationError";
    this.path = path;
    this.errors = errors;
  }
}

export class PermissionDeniedError extends BaseSafeboxError {
  public readonly path: Path;

  constructor(path: Path, ...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PermissionDeniedError);
    }

    this.name = "PermissionDeniedError";
    this.path = path;
  }
}

export class ObjectError extends BaseSafeboxError {
  public readonly path: Path;

  constructor(path: Path, ...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ObjectError);
    }

    this.name = "ObjectError";
    this.path = path;
  }
}