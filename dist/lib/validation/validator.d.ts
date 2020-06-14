import {JSONSchema4} from "json-schema";
import {Path} from "../types";

export declare class Validator {
  private readonly validator;
  private readonly schema;
  private pathToSubSchema;

  constructor(schema: JSONSchema4);

  get pathValidationSupport(): boolean;

  get errors(): any;

  isValid(path: Path, value: any): boolean;
}
