import { Path, PathAction, PathPermissionSetting } from "../../types";
export declare class PermissionChecker {
    private static PERMISSIONS_KEY;
    private readonly permissionTree;
    constructor(permissions: PathPermissionSetting[]);
    addPermission(permission: PathPermissionSetting): void;
    checkPermission(action: PathAction, path: Path, value?: any): {
        hasPermission: boolean;
        problems: Path[];
    };
    private findContradictingPermissions;
    private getPermissionForPath;
}
