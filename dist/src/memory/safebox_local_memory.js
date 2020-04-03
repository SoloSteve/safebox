"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const object_access_1 = require("../core/utils/object_access");
class SafeboxLocalMemory {
    constructor() {
        this.obj = {};
    }
    doesExist(path) {
        return lodash_1.has(this.obj, path);
    }
    get(path) {
        if (path !== undefined && path.length !== 0) {
            return object_access_1.get(this.obj, path);
        }
        else {
            return this.obj;
        }
    }
    set(path, value) {
        if (path !== undefined && path.length !== 0) {
            object_access_1.set(this.obj, path, value);
        }
        else {
            this.obj = value;
        }
    }
}
exports.SafeboxLocalMemory = SafeboxLocalMemory;
//# sourceMappingURL=safebox_local_memory.js.map