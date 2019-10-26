import * as Ajv from 'ajv';
import {JSONSchema4} from 'json-schema';
import {Path} from "../types";

export default class Validation {
  private readonly validator: Ajv.Ajv;
  private readonly schema: any;

  constructor(schema: JSONSchema4) {
    this.validator = new Ajv({});
    this.schema = schema;
  }

  /**
   *
   *
   * @note: Taken from https://github.com/RangerMauve/json-schema-from-path/blob/master/index.js (October 25, 2019)
   * @param schema: A JSON schema to traverse.
   * @param path: The path to the desired sub-schema.
   */
  private static getSubSchema(schema: JSONSchema4 | null, path: Path): JSONSchema4 | null {
    if (!schema) return null;
    if (!path.length) return schema;
    if (path.length === 1 && !path[0]) return schema;

    const nextSegment = path[0];
    const subSegments = path.slice(1);
    const subSchema = null;

    if (schema.properties) {
      return this.getSubSchema(schema.properties[nextSegment], subSegments);
    } else if (schema.patternProperties !== undefined) {
      const patterns = schema.patternProperties;
      for (let pattern of Object.keys(patterns)) {
        if ((new RegExp(pattern)).test(nextSegment)) {
          return this.getSubSchema(patterns[pattern], subSegments);
        }
      }
    } else if (schema.additionalProperties) {
      return this.getSubSchema(schema.additionalProperties as JSONSchema4, subSegments);
    } else if (schema.items !== undefined) {
      return this.getSubSchema(schema.items, subSegments);
    } else if (schema.oneOf !== undefined) {
      // Find oneOf element that has a matching property for next segment:
      const oneOfTarget = schema.oneOf.filter(item => {
        return item.properties && item.properties[nextSegment]
      })[0];
      if (oneOfTarget.properties !== undefined) {
        return this.getSubSchema(oneOfTarget && oneOfTarget.properties[nextSegment], subSegments);
      }
    } else {
      // There's no deeper schema defined
      return null;
    }
    return this.getSubSchema(subSchema, subSegments);
  }

  public isValid(path: Path, value: any): boolean {
    const subSchema: any | null = Validation.getSubSchema(this.schema, path);
    if (subSchema === null) return false;
    return this.validator.validate(subSchema, value) as boolean;
  }
}
