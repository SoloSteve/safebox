import {JSONSchema4} from "json-schema";
import Permission from "./features/permission/permission";

// Global Types

export type Path = string[];

// Permission Types

export enum PathAction {
  GET,
  SET
}


export interface PathPermissionSetting {
  path: Path,
  permissions: Permission
}


export interface SafeboxConfiguration {
  schema: JSONSchema4
}

// Validation Types

export type KeywordHandler = (schema: any, key: string) => string[] | false;

// Safebox Types

export enum AccessStatusCode {
  SUCCESS,
  PERMISSION_DENIED,
  INVALID_PATH,
  INVALID_VALUE

}

export interface Access {
  value?: any;
  status: AccessStatusCode
}