"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessStatusCode = exports.PathAction = void 0;
var PathAction;
(function (PathAction) {
    PathAction[PathAction["GET"] = 0] = "GET";
    PathAction[PathAction["SET"] = 1] = "SET";
})(PathAction = exports.PathAction || (exports.PathAction = {}));
var AccessStatusCode;
(function (AccessStatusCode) {
    AccessStatusCode[AccessStatusCode["SUCCESS"] = 0] = "SUCCESS";
    AccessStatusCode[AccessStatusCode["PERMISSION_DENIED"] = 1] = "PERMISSION_DENIED";
    AccessStatusCode[AccessStatusCode["INVALID_PATH"] = 2] = "INVALID_PATH";
    AccessStatusCode[AccessStatusCode["INVALID_VALUE"] = 3] = "INVALID_VALUE";
})(AccessStatusCode = exports.AccessStatusCode || (exports.AccessStatusCode = {}));
//# sourceMappingURL=types.js.map