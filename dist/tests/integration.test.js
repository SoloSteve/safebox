"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const safebox_1 = require("../lib/safebox");
const local_memory_1 = require("../memory/local_memory");
const path_permission_1 = require("../lib/permission/path_permission");
const types_1 = require("../lib/types");
describe("Normal Flow", () => {
    const safebox = new safebox_1.Safebox({
        type: "object",
        properties: {
            name: {
                type: "string"
            },
            age: {
                type: "number"
            },
            children: {
                type: "array",
                items: {
                    type: "string"
                }
            }
        }
    }, new local_memory_1.LocalMemory(), { name: "Bob", age: 32, children: [] });
    const agent = safebox.getAgent(new path_permission_1.PathPermission([], path_permission_1.PermissionType.GET, path_permission_1.PermissionType.MUTATE), new path_permission_1.PathPermission(["age"], path_permission_1.PermissionType.GET), new path_permission_1.PathPermission(["children"], path_permission_1.PermissionType.GET, path_permission_1.PermissionType.CREATE, path_permission_1.PermissionType.MUTATE));
    test("Get Bob", () => {
        expect(agent.get()).toEqual({ name: "Bob", age: 32, children: [] });
    });
    test("Get Bob's name", () => {
        expect(agent.get(["name"])).toEqual("Bob");
    });
    test("Add child to Bob", () => {
        expect(() => {
            agent.create(["children", "0"], "Steve");
        }).not.toThrow();
    });
    test("Try to add another first child", () => {
        expect(() => {
            agent.create(["children", "0"], "Stephen");
        }).toThrow(types_1.ObjectError);
    });
    test("Try to mutate Bob's properties", () => {
        expect(() => {
            agent.mutate(["name"], "Dan");
        }).not.toThrow();
        expect(() => {
            agent.mutate(["age"], "Dan");
        }).toThrow(types_1.PermissionDeniedError);
    });
    test("Try to make name a number", () => {
        expect(() => {
            agent.mutate(["name"], 101);
        }).toThrow(types_1.ValidationError);
    });
    test("Try to add another property", () => {
        expect(() => {
            agent.create(["State"], "California");
        }).toThrow(types_1.PermissionDeniedError);
    });
    test("Check final result", () => {
        expect(agent.get()).toEqual({
            name: "Dan",
            age: 32,
            children: ["Steve"]
        });
    });
});
//# sourceMappingURL=integration.test.js.map