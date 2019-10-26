import {JSONSchema4} from "json-schema";

export enum Permission {

}

export enum AccessType {
  READ,
  WRITE
}

export enum AccessPermit {
  ACCEPT,
  DENY
}

export interface PathPermission {
  path: Path,
  accessType: AccessType,
  accessPermit: AccessPermit
}

export type Path = string[];


export interface SafeboxConfiguration {
  schema: JSONSchema4
}

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