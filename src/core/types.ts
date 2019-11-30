import {JSONSchema4} from "json-schema";

// Global Types

export type Path = string[];

// Permission Types

export enum PathAction {
  GET,
  SET
}

export enum PathPermission {
  CAN_GET,
  CAN_SET,
  NO_GET,
  NO_SET
}

export interface PathPermissionSetting {
  path: Path,
  pathPermissionTypes: Set<PathPermission>
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