"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keywordHandlers = void 0;
exports.keywordHandlers = {
    "properties": (schema, key) => {
        if (schema.hasOwnProperty("properties")
            && schema["properties"].hasOwnProperty(key)) {
            return ["properties", key];
        }
        return false;
    },
    "items": (schema, key) => {
        if (Number.isInteger(parseInt(key))) {
            return ["items"];
        }
        return false;
    }
};
//# sourceMappingURL=fast_validation_keyword_handlers.js.map