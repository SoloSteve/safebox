"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permission_checker_1 = require("./permission_checker");
const types_1 = require("../../types");
const permission_1 = require("./permission");
describe("Check Permissions", () => {
    const permission = new permission_checker_1.PermissionChecker([
        { path: [], permissions: new permission_1.Permission() },
        { path: ["root"], permissions: new permission_1.Permission(types_1.PathAction.GET) },
        { path: ["metadata"], permissions: new permission_1.Permission() },
        { path: ["root", "readable"], permissions: new permission_1.Permission(types_1.PathAction.GET) },
        { path: ["root", "read_and_write"], permissions: new permission_1.Permission(types_1.PathAction.GET, types_1.PathAction.SET) },
        { path: ["root", "read_and_write", "only_write"], permissions: new permission_1.Permission(types_1.PathAction.SET) },
        { path: ["root", "readable", "my_space"], permissions: new permission_1.Permission(types_1.PathAction.SET, types_1.PathAction.GET) },
        { path: ["root", "readable", "my_space", "id"], permissions: new permission_1.Permission(types_1.PathAction.GET) },
        { path: ["root", "readable", "my_space", "inner", "inner2"], permissions: new permission_1.Permission() },
    ]);
    test("Creates the permission tree correctly", () => {
        expect(permission.permissionTree).toEqual({
            [permission_checker_1.PermissionChecker.PERMISSIONS_KEY]: new permission_1.Permission(),
            root: {
                [permission_checker_1.PermissionChecker.PERMISSIONS_KEY]: new permission_1.Permission(types_1.PathAction.GET),
                readable: {
                    [permission_checker_1.PermissionChecker.PERMISSIONS_KEY]: new permission_1.Permission(types_1.PathAction.GET),
                    my_space: {
                        [permission_checker_1.PermissionChecker.PERMISSIONS_KEY]: new permission_1.Permission(types_1.PathAction.GET, types_1.PathAction.SET),
                        id: {
                            [permission_checker_1.PermissionChecker.PERMISSIONS_KEY]: new permission_1.Permission(types_1.PathAction.GET),
                        },
                        inner: {
                            inner2: {
                                [permission_checker_1.PermissionChecker.PERMISSIONS_KEY]: new permission_1.Permission(),
                            }
                        }
                    }
                },
                read_and_write: {
                    [permission_checker_1.PermissionChecker.PERMISSIONS_KEY]: new permission_1.Permission(types_1.PathAction.GET, types_1.PathAction.SET),
                    only_write: {
                        [permission_checker_1.PermissionChecker.PERMISSIONS_KEY]: new permission_1.Permission(types_1.PathAction.SET),
                    }
                }
            },
            metadata: {
                [permission_checker_1.PermissionChecker.PERMISSIONS_KEY]: new permission_1.Permission(),
            }
        });
    });
    test("Root level no get", () => {
        expect(permission.checkPermission(types_1.PathAction.GET, ["metadata"], 99)).toEqual({
            hasPermission: false, problems: [
                ["metadata"]
            ]
        });
    });
    test("Root level no set", () => {
        expect(permission.checkPermission(types_1.PathAction.SET, ["metadata"], 99)).toEqual({
            hasPermission: false, problems: [
                ["metadata"]
            ]
        });
    });
    test("Get with problem", () => {
        expect(permission.checkPermission(types_1.PathAction.GET, ["root", "readable"])).toEqual({
            hasPermission: false, problems: [
                ["root", "readable", "my_space", "inner", "inner2"]
            ]
        });
    });
    test("Get with multiple problems", () => {
        expect(permission.checkPermission(types_1.PathAction.GET, ["root"]).problems).toEqual(expect.arrayContaining([
            ["root", "readable", "my_space", "inner", "inner2"],
            ["root", "read_and_write", "only_write"]
        ]));
    });
    test("No root permissions", () => {
        expect(permission.checkPermission(types_1.PathAction.GET, [])).toEqual({
            hasPermission: false,
            problems: [
                []
            ]
        });
    });
    test("Set single value", () => {
        expect(permission.checkPermission(types_1.PathAction.SET, ["root", "read_and_write", "only_write"], 99)).toEqual({
            hasPermission: true,
            problems: []
        });
    });
    test("Set complex value", () => {
        expect(permission.checkPermission(types_1.PathAction.SET, ["root", "read_and_write"], {
            only_write: 99,
            other: {
                unknown: 99
            },
            objects: 99
        })).toEqual({
            hasPermission: true,
            problems: []
        });
    });
    test("Set complex value with issues", () => {
        expect(permission.checkPermission(types_1.PathAction.SET, ["root", "readable", "my_space"], {
            id: 99,
            something: {
                else: 99
            }
        })).toEqual({
            hasPermission: false,
            problems: [
                ["root", "readable", "my_space", "id"],
                ["root", "readable", "my_space", "inner", "inner2"]
            ]
        });
    });
    test("Set complex value with unknown inner value permissions", () => {
        expect(permission.checkPermission(types_1.PathAction.SET, ["root", "read_and_write"], {
            not: {
                even: 99,
                close: 99
            }
        })).toEqual({
            hasPermission: true,
            problems: []
        });
    });
});
//# sourceMappingURL=permission.test.js.map