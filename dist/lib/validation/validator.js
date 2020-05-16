"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const Ajv = require("ajv");
const keyword_handlers_1 = require("./keyword_handlers");
const path_utils_1 = require("../path_utils");
const traverse = require("json-schema-traverse");
const PARENT_KEYWORD_INDEX = 4;
class Validator {
    constructor(schema) {
        this.validator = new Ajv({});
        this.validator = new Ajv({});
        this.validator.addSchema(schema);
        this.schema = schema;
        if (!this.pathValidationSupport)
            throw new Error("This schema is unsupported at this time");
    }
    get pathValidationSupport() {
        let isSupported = true;
        traverse(this.schema, (...data) => {
            if (!Object.keys(keyword_handlers_1.SCHEMA_KEYWORD_HANDLERS).includes(data[PARENT_KEYWORD_INDEX])
                && data[PARENT_KEYWORD_INDEX] !== undefined) {
                isSupported = false;
            }
        });
        return isSupported;
    }
    isValid(path, value) {
        const subSchema = this.pathToSubSchema(path);
        return this.validator.validate(subSchema, value);
    }
    pathToSubSchema(path) {
        let currentSubSchema = this.schema;
        path.forEach((pathSegment) => {
            for (let schemaKeywordHandler of Object.values(keyword_handlers_1.SCHEMA_KEYWORD_HANDLERS)) {
                const partialSchemaPath = schemaKeywordHandler(currentSubSchema, pathSegment);
                if (partialSchemaPath !== false) {
                    currentSubSchema = path_utils_1.get(currentSubSchema, partialSchemaPath);
                    return;
                }
            }
            throw new Error(`Unable to find sub-schema: Unable to handle path segment: ${pathSegment}`);
        });
        return currentSubSchema;
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map