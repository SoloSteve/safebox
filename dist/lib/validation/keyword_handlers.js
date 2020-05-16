"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCHEMA_KEYWORD_HANDLERS = void 0;
exports.SCHEMA_KEYWORD_HANDLERS = {};
exports.SCHEMA_KEYWORD_HANDLERS["properties"] = function (schema, pathSegment) {
    if (schema.hasOwnProperty("properties")
        && schema.properties !== undefined
        && schema.properties.hasOwnProperty(pathSegment)) {
        return ["properties", pathSegment];
    }
    return false;
};
exports.SCHEMA_KEYWORD_HANDLERS["items"] = function (schema, pathSegment) {
    if (Number.isInteger(parseInt(pathSegment, 10))) {
        return ["items"];
    }
    return false;
};
exports.SCHEMA_KEYWORD_HANDLERS["additionalProperties"] = function (schema, pathSegment) {
    if (schema.hasOwnProperty("additionalProperties")
        && schema.additionalProperties !== undefined) {
        return ["additionalProperties"];
    }
    return false;
};
//# sourceMappingURL=keyword_handlers.js.map