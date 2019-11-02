import {JSONSchema4} from "json-schema";

// Global Types

export type Path = string[];

// Permissions

export enum PermissionRequestType {
  READ,
  WRITE
}

export enum PathPermissionType {
  READ,
  WRITE,
  NO_READ,
  NO_WRITE
}

export interface PathPermission {
  path: Path,
  pathPermissionTypes: Set<PathPermissionType>
}


export interface SafeboxConfiguration {
  schema: JSONSchema4
}

// Safebox Types

export enum AccessStatusCode {
  SUCCESS,
  PERMISSION_DENIED,
  INVALID_PATH,
  INVALID_VALUE

}

export interface Access {
  value: any;
  status: AccessStatusCode
}