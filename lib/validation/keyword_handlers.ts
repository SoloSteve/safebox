import {JSONSchema4} from "json-schema";
import {Path} from "../types";

export type SchemaKeywordHandlerCollection = { [key: string]: SchemaKeywordHandler };

/**
 * A schema keyword handler takes a path segment from a data object path and returns
 * the schema object path that corresponds the data object path.
 *
 * Used to convert from one type of path to the other type.
 *
 * Returns a partial path that can be used to access the sub-schema, or false if the path segment does
 * not exist in the current schema.
 *
 * @example
 *
 * If my schema looked like this:
 *
 * {
 *   "type": "object",
 *   "properties": {
 *     "foo": {
 *       "type": "number",
 *       "maximum": 90
 *     },
 *     "bar": {
 *       "type": "object",
 *       // ...
 *     }
 *   }
 * }
 *
 * and my path segment was "foo" then the path returned would be ["properties", "foo"].
 *
 */
export type SchemaKeywordHandler = (schema: JSONSchema4, pathSegment: string) => Path | false;


export const SCHEMA_KEYWORD_HANDLERS: SchemaKeywordHandlerCollection = {};

SCHEMA_KEYWORD_HANDLERS["properties"] = function (schema, pathSegment) {
  if (
    schema.hasOwnProperty("properties")
    && schema.properties !== undefined
    && schema.properties.hasOwnProperty(pathSegment)
  ) {
    return ["properties", pathSegment];
  }
  return false;
};

SCHEMA_KEYWORD_HANDLERS["items"] = function (schema, pathSegment) {
  // Checks if pathSegment is a whole positive number
  if (/^\d+$/.test(pathSegment)) {
    return ["items"];
  }
  return false;
};

SCHEMA_KEYWORD_HANDLERS["additionalProperties"] = function (schema, pathSegment) {
  if (
    schema.hasOwnProperty("additionalProperties")
    && schema.additionalProperties !== undefined
  ) {
    return ["additionalProperties"];
  }
  return false;
};

