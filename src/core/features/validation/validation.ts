import {JSONSchema4} from "json-schema";
import * as Ajv from "ajv";
import * as traverse from "json-schema-traverse";
import {Path} from "../../types";
import KeywordHandlers from "./fast_check_keyword_handlers";
import {get} from "lodash";

const PARENT_KEYWORD_INDEX = 4;

export default class Validation {
  private readonly validator: Ajv.Ajv;
  private readonly schema: JSONSchema4;
  private readonly hasFastCheck: boolean;


  constructor(schema: JSONSchema4) {
    this.validator = new Ajv({});
    this.schema = schema;
    this.hasFastCheck = this.checkHasFastCheck();
  }

  private checkHasFastCheck(): boolean {
    let isSupported = true;

    traverse(this.schema, (...data: any) => {
      if (!Object.keys(KeywordHandlers).includes(data[PARENT_KEYWORD_INDEX])) {
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