"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalMemory = void 0;
const lodash_1 = require("lodash");
const utils_1 = require("../lib/utils");

class LocalMemory {
  constructor() {
    this.object = {};
  }

  delete(path) {
    if (!this.doesPathExist(path))
      return false;
    return lodash_1.unset(this.object, path);
  }

  doesPathExist(path) {
    if (path.length == 0)
      return true;
    return lodash_1.has(this.object, path);
  }

  get(path) {
    if (path.length == 0)
      return this.object;
    return lodash_1.get(this.object, path);
  }

  merge(path, value) {
    if (!this.doesPathExist(path))
      return false;
    const currentValue = this.get(path);
    value = utils_1.merge(currentValue, value);
    this.set(path, value);
    return true;
  }

  set(path, value) {
    if (path.length == 0) {
      this.object = value;
      return true;
    }
    utils_1.set(this.object, path, value);
    return true;
  }
}
exports.LocalMemory = LocalMemory;
//# sourceMappingURL=local_memory.js.map