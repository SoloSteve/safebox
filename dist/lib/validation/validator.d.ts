import {JSONSchema4} from "json-schema";
import {Path} from "../types";

export declare class Validator {
  private readonly validator;
  private readonly schema;

  constructor(schema: JSONSchema4);

  get pathValidationSupport(): boolean;

  isValid(path: Path, value: any): boolean;

  get errors(): any;

  private pathToSubSchema;
}
