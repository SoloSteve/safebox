import {JSONSchema4} from "json-schema";
import * as Ajv from "ajv";
import {Path} from "../../types";
import KeywordHandlers from "./fast_validation_keyword_handlers";
import {has} from "lodash";
import {get} from "../../utils/object_access";

const traverse = require("json-schema-traverse");

const PARENT_KEYWORD_INDEX = 4;

export default class Validation {
  private readonly validator: Ajv.Ajv;
  private readonly schema: JSONSchema4;
  public readonly hasFastValidation: boolean;


  constructor(schema: JSONSchema4) {
    this.validator = new Ajv({});
    this.validator.addSchema(schema);
    this.schema = schema;
    this.hasFastValidation = this.checkFastValidationSupport();
  }

  public isBoxValid(box: any): boolean {
    return this.validator.validate(this.schema, box) as boolean;
  }

  public isValid(path: Path, value: any): boolean {
    if (this.hasFastValidation) {
      const schemaPath = this.objectPathToSchemaPath(path);
      if (schemaPath.length > 0 && !has(this.schema, schemaPath)) {
        return false;
      }
      const innerSchema = (schemaPath.length > 0) ? get(this.schema, schemaPath) : this.schema;
      return this.validator.validate(innerSchema, value) as boolean;
    } else {
      throw new Error("Fast validation not supported with the current schema");
    }
  }

  private checkFastValidationSupport(): boolean {
    let isSupported = true;

    traverse(this.schema, (...data: any) => {
      if (
        !Object.keys(KeywordHandlers).includes(data[PARENT_KEYWORD_INDEX])
        && data[PARENT_KEYWORD_INDEX] !== undefined
      ) {
        isSupported = false;
      }
    });

    return isSupported;
  }

  private objectPathToSchemaPath(objectPath: Path): Path {
    let currentSchemaBlock = this.schema;
    let schemaPath: Path = [];

    objectPath.forEach((pathSegment => {
      for (let keyword of Object.keys(KeywordHandlers)) {
        const result = KeywordHandlers[keyword](currentSchemaBlock, pathSegment);
        if (result !== false) {
          currentSchemaBlock = get(currentSchemaBlock, result);
          schemaPath.push(...result);
          break;
        }
      }
    }));

    return schemaPath;
  }
}