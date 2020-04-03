import { JSONSchema4 } from "json-schema";
import { Permission } from "./features/permission/permission";
export declare type Path = string[];
export declare enum PathAction {
    GET = 0,
    SET = 1
}
export interface PathPermissionSetting {
    path: Path;
    permissions: Permission;
}
export interface SafeboxConfiguration {
    schema: JSONSchema4;
}
export declare type KeywordHandler = (schema: any, key: string) => string[] | false;
export declare enum AccessStatusCode {
    SUCCESS = 0,
    PERMISSION_DENIED = 1,
    INVALID_PATH = 2,
    INVALID_VALUE = 3
}
export interface Access {
    value?: any;
    status: AccessStatusCode;
}
