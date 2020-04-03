"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = require("ajv");
const fast_validation_keyword_handlers_1 = require("./fast_validation_keyword_handlers");
const lodash_1 = require("lodash");
const object_access_1 = require("../../utils/object_access");
const traverse = require("json-schema-traverse");
const PARENT_KEYWORD_INDEX = 4;
class Validation {
    constructor(schema) {
        this.validator = new Ajv({});
        this.validator.addSchema(schema);
        this.schema = schema;
        this.hasFastValidation = this.checkFastValidationSupport();
    }
    isBoxValid(box) {
        return this.validator.validate(this.schema, box);
    }
    isValid(path, value) {
        if (this.hasFastValidation) {
            const schemaPath = this.objectPathToSchemaPath(path);
            if (schemaPath.length > 0 && !lodash_1.has(this.schema, schemaPath)) {
                return false;
            }
            const innerSchema = (schemaPath.length > 0) ? object_access_1.get(this.schema, schemaPath) : this.schema;
            return this.validator.validate(innerSchema, value);
        }
        else {
            throw new Error("Fast validation not supported with the current schema");
        }
    }
    checkFastValidationSupport() {
        let isSupported = true;
        traverse(this.schema, (...data) => {
            if (!Object.keys(fast_validation_keyword_handlers_1.keywordHandlers).includes(data[PARENT_KEYWORD_INDEX])
                && data[PARENT_KEYWORD_INDEX] !== undefined) {
                isSupported = false;
            }
        });
        return isSupported;
    }
    objectPathToSchemaPath(objectPath) {
        let currentSchemaBlock = this.schema;
        let schemaPath = [];
        objectPath.forEach((pathSegment => {
            for (let keyword of Object.keys(fast_validation_keyword_handlers_1.keywordHandlers)) {
                const result = fast_validation_keyword_handlers_1.keywordHandlers[keyword](currentSchemaBlock, pathSegment);
                if (result !== false) {
                    currentSchemaBlock = object_access_1.get(currentSchemaBlock, result);
                    schemaPath.push(...result);
                    break;
                }
            }
        }));
        return schemaPath;
    }
}
exports.Validation = Validation;
//# sourceMappingURL=validation.js.map