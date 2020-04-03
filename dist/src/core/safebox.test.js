"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const safebox_1 = require("./safebox");
const safebox_local_memory_1 = require("../memory/safebox_local_memory");
const permission_1 = require("./features/permission/permission");
const types_1 = require("./types");
const permission_checker_1 = require("./features/permission/permission_checker");
describe("Integration Test", () => {
    const safebox = new safebox_1.Safebox(new safebox_local_memory_1.SafeboxLocalMemory(), {
        schema: {
            type: "object",
            properties: {
                users: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string"
                            },
                            location: {
                                type: "object",
                                properties: {
                                    lat: {
                                        type: "integer",
                                        maximum: 90,
                                        minimum: -90
                                    },
                                    lng: {
                                        type: "integer",
                                        maximum: 180,
                                        minimum: -180
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        permissions: [
            { path: [], permissions: new permission_1.Permission(types_1.PathAction.GET, types_1.PathAction.SET) }
        ]
    });
    test("Setting the template", () => {
        expect(safebox.set({
            users: [],
        })).toEqual({
            status: types_1.AccessStatusCode.SUCCESS
        });
        expect(safebox.memory.get()).toEqual({
            users: []
        });
    });
    test("Adding a user without id permissions", () => {
        expect(safebox.set({
            id: "steve",
            location: {
                lat: 44,
                lng: -99
            }
        }, ["users", "0"], new permission_checker_1.PermissionChecker([
            { path: [], permissions: new permission_1.Permission(types_1.PathAction.GET, types_1.PathAction.SET) },
            { path: ["users", "0", "id"], permissions: new permission_1.Permission() },
        ]))).toEqual({
            status: types_1.AccessStatusCode.PERMISSION_DENIED
        });
    });
    test("Adding a user with permissions", () => {
        safebox.set({
            users: [
                {}
            ]
        });
        expect(safebox.set({
            id: "steve",
            location: {
                lat: 44,
                lng: -99
            }
        }, ["users", "0"])).toEqual({
            status: types_1.AccessStatusCode.SUCCESS
        });
        expect(safebox.memory.get()).toEqual({
            users: [
                {
                    id: "steve",
                    location: {
                        lat: 44,
                        lng: -99
                    }
                }
            ]
        });
    });
    test("Get everything with partial", () => {
        safebox.memory.set([], {
            users: [
                {
                    id: "steve",
                    location: {
                        lat: 44,
                        lng: -99
                    }
                }
            ]
        });
        expect(safebox.get(undefined, true, new permission_checker_1.PermissionChecker([
            { path: [], permissions: new permission_1.Permission(types_1.PathAction.GET, types_1.PathAction.SET) },
            { path: ["users", "0", "id"], permissions: new permission_1.Permission() }
        ])).value).toEqual({
            users: [
                {
                    location: {
                        lat: 44,
                        lng: -99
                    }
                }
            ]
        });
    });
});
//# sourceMappingURL=safebox.test.js.map