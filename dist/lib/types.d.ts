export declare type Path = string[];
export declare class ValidationError extends Error {
    readonly path: Path;
    constructor(path: Path, ...params: any);
}
export declare class PermissionDeniedError extends Error {
    readonly path: Path;
    constructor(path: Path, ...params: any);
}
export declare class ObjectError extends Error {
    readonly path: Path;
    constructor(path: Path, ...params: any);
}
