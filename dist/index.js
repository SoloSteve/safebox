"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true, get: function () {
      return m[k];
    }
  });
}) : (function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function (m, exports) {
  for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
}
Object.defineProperty(exports, "__esModule", {value: true});
var safebox_1 = require("./lib/safebox");
Object.defineProperty(exports, "Safebox", {
  enumerable: true, get: function () {
    return safebox_1.Safebox;
  }
});
Object.defineProperty(exports, "SafeboxAgent", {
  enumerable: true, get: function () {
    return safebox_1.SafeboxAgent;
  }
});
var local_memory_1 = require("./memory/local_memory");
Object.defineProperty(exports, "LocalMemory", {
  enumerable: true, get: function () {
    return local_memory_1.LocalMemory;
  }
});
var path_permission_1 = require("./lib/permission/path_permission");
Object.defineProperty(exports, "PathPermission", {
  enumerable: true, get: function () {
    return path_permission_1.PathPermission;
  }
});
Object.defineProperty(exports, "PermissionType", {
  enumerable: true, get: function () {
    return path_permission_1.PermissionType;
  }
});
__exportStar(require("./lib/types"), exports);
//# sourceMappingURL=index.js.map