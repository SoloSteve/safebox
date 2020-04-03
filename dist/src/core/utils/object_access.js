"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function get(obj, path, defaultValue) {
    if (path.length === 0) {
        return obj;
    }
    else {
        return lodash_1.get(obj, path, defaultValue);
    }
}
exports.get = get;
function set(obj, path, value) {
    if (path.length === 0) {
        obj = value;
    }
    else {
        lodash_1.set(obj, path, value);
    }
}
exports.set = set;
//# sourceMappingURL=object_access.js.map