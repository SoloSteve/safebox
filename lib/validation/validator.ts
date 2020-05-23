import {JSONSchema4} from "json-schema";
import * as Ajv from "ajv";
import {Path} from "../types";
import {SCHEMA_KEYWORD_HANDLERS} from "./keyword_handlers";
import {get} from "../path_utils";

const traverse = require("json-schema-traverse");
const PARENT_KEYWORD_INDEX = 4;

export class Validator {
  private readonly validator: Ajv.Ajv = new Ajv({});
  private readonly schema: JSONSchema4;

  constructor(schema: JSONSchema4) {
    this.validator = new Ajv({});
    this.validator.addSchema(schema);
    this.schema = schema;

    if (!this.pathValidationSupport) throw new Error("This schema is unsupported at this time");
  }

  /**
   * @returns {boolean}: Whether or not the schema only includes keywords that are supported by path validation.
   */
  public get pathValidationSupport(): boolean {
    let isSupported = true;

    traverse(this.schema, (...data: any) => {
      if (
        !Object.keys(SCHEMA_KEYWORD_HANDLERS).includes(data[PARENT_KEYWORD_INDEX])
        && data[PARENT_KEYWORD_INDEX] !== undefined
      ) {
        isSupported = false;
      }
    });

    return isSupported;
  }

  /**
   * Validates a value against the a sub-schema defined by the path.
   *
   * @see Validator.pathToSubSchema for more information.
   *
   * @param path
   * @param value
   */
  public isValid(path: Path, value: any): boolean {
    const subSchema = this.pathToSubSchema(path);
    if (subSchema === false) {
      return false;
    }
    return <boolean>this.validator.validate(subSchema, value);
  }

  /**
   * Takes an object access path and returns the sub-schema that would be used to validate it.
   *
   * An object access path specifies the path that would be used to access a value from the
   * corresponding object that is represented by the schema. In other words, it should not include
   * schema specific keywords such as "properties" since these types of keys would not appear
   * on the data object itself.
   *
   * @example:
   * Take a path:
   * ["bar", "3"]
   *
   * Given the schema:
   *
   * {
   *   "type": "object",
   *   "properties": {
   *     "foo": {
   *       "type": "number",
   *       "maximum": 90
   *     },
   *     "bar": {
   *       "type": "array",
   *       "items": {
   *         "type": "string",
   *         "maxLength": 8
   *       }
   *     }
   *   }
   * }
   *
   *
   * The result would be the sub-schema:
   *
   * {
   *   "type": "array",
   *   "items": {
   *     "type": "string",
   *     "maxLength": 8
   *   }
   * }
   *
   * @param {Path} path: The path (object access format) to return the sub-schema for.
   *
   * @throws {Error}: If the path does not correspond to a sub-schema.
   */
  private pathToSubSchema(path: Path): JSONSchema4 | false {
    let currentSubSchema = this.schema; // Start from the root.

    segmentLoop:
      for (let pathSegment of path) {
        for (let schemaKeywordHandler of Object.values(SCHEMA_KEYWORD_HANDLERS)) {
          const partialSchemaPath = schemaKeywordHandler(currentSubSchema, pathSegment);
          if (partialSchemaPath !== false) {
            currentSubSchema = get(currentSubSchema, partialSchemaPath);
            continue segmentLoop;
          }
        }
        return false;
      }

    return currentSubSchema;
  }
}