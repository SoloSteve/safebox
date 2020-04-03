import { JSONSchema4 } from "json-schema";
import { Path } from "../../types";
export declare class Validation {
    private readonly validator;
    private readonly schema;
    readonly hasFastValidation: boolean;
    constructor(schema: JSONSchema4);
    isBoxValid(box: any): boolean;
    isValid(path: Path, value: any): boolean;
    private checkFastValidationSupport;
    private objectPathToSchemaPath;
}
