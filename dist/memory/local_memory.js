"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalMemory = void 0;
const lodash_1 = require("lodash");
class LocalMemory {
  constructor() {
    this.object = {};
  }

  create(path, value) {
    if (path.length == 0) {
      this.object = value;
      return true;
    }
    if (!this.doesPathExist(path.slice(0, -1)) || this.doesPathExist(path))
      return false;
    lodash_1.set(this.object, path, value);
    return true;
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
    lodash_1.merge(this.get(path), value);
    return true;
  }

  mutate(path, value) {
    if (!this.doesPathExist(path))
      return false;
    lodash_1.set(this.object, path, value);
        return true;
    }
}
exports.LocalMemory = LocalMemory;
//# sourceMappingURL=local_memory.js.map