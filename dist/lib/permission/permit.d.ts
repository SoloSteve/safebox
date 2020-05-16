import { PathPermission, PermissionType } from "./path_permission";
import { Path } from "../types";
export declare class Permit {
    private static readonly PERMISSIONS_KEY;
    private readonly permissionTree;
    constructor(...permissions: PathPermission[]);
    addPermissions(...permissions: PathPermission[]): void;
    getConflicts(permissionType: PermissionType, path: Path, valueAtPath: any): Path[];
    private getLeafPaths;
    private getPermissionForPath;
}
