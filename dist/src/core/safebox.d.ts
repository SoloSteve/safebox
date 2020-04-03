import { ISafeboxMemory } from "./isafebox_memory";
import { PermissionChecker } from "./features/permission/permission_checker";
import { JSONSchema4 } from "json-schema";
import { Access, Path, PathPermissionSetting } from "./types";
export declare class Safebox {
    private readonly memory;
    private readonly validation;
    private readonly permission;
    constructor(memory: ISafeboxMemory, options: SafeboxOptions);
    get(path?: Path, partial?: boolean, permission?: PermissionChecker): Access;
    set(value: any, path?: Path, permission?: PermissionChecker): Access;
}
interface SafeboxOptions {
    schema: JSONSchema4;
    permissions?: PathPermissionSetting[];
}
export {};
