"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.get = void 0;
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
        Object.assign(obj, value);
    }
    else {
        lodash_1.setWith(obj, path, value, Object);
    }
}
exports.set = set;
//# sourceMappingURL=path_utils.js.map