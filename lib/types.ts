export type Path = string[];

export class ValidationError extends Error {
  public readonly path: Path;

  constructor(path: Path, ...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }

    this.name = "ValidationError";
    this.path = path;
  }
}

export class PermissionDeniedError extends Error {
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

export class ObjectError extends Error {
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