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
      hat: {
        type: "boolean"
      },
      children: {
        type: "array",
        items: {
          type: "string"
        }
      }
    },
    additionalProperties: {
      type: "boolean"
    }
  }, new local_memory_1.LocalMemory(), {name: "Bob", age: 32, hat: true, children: []});
  const agent = safebox.getAgent(new path_permission_1.PathPermission([], path_permission_1.PermissionType.GET, path_permission_1.PermissionType.SET), new path_permission_1.PathPermission(["age"], path_permission_1.PermissionType.GET), new path_permission_1.PathPermission(["hat"], path_permission_1.PermissionType.SET, path_permission_1.PermissionType.GET, path_permission_1.PermissionType.DELETE), new path_permission_1.PathPermission(["children"], path_permission_1.PermissionType.GET, path_permission_1.PermissionType.SET, path_permission_1.PermissionType.DELETE));
  test("Get Bob", () => {
    expect(agent.get()).toEqual({name: "Bob", age: 32, hat: true, children: []});
  });
  test("Get Bob's name", () => {
    expect(agent.get(["name"])).toEqual("Bob");
  });
  test("Add child to Bob", () => {
    expect(() => {
      agent.set(["children", "0"], "Steve");
    }).not.toThrow();
  });
  test("Try to add another first child", () => {
    expect(() => {
      agent.set(["children", "0"], "Stephen");
    }).not.toThrow();
  });
  test("Try to mutate Bob's properties", () => {
    expect(() => {
      agent.merge(["name"], "Dan");
    }).not.toThrow();
    expect(() => {
      agent.set(["age"], "Dan");
    }).toThrow(types_1.PermissionDeniedError);
  });
  test("Try to make name a number", () => {
    expect(() => {
      agent.set(["name"], 101);
    }).toThrow(types_1.ValidationError);
  });
  test("Try to add another property", () => {
    expect(() => {
      agent.set(["State"], "California");
    }).toThrow(types_1.ValidationError);
  });
  test("Try to add deep property", () => {
    expect(() => {
      safebox.set(["something", "that", "doesn't", "exist"], 0);
    }).toThrow(types_1.ValidationError);
  });
  test("Try to delete unknown object", () => {
    expect(() => {
      agent.delete(["children", "1"]);
      agent.delete(["age", "quantum"]);
    }).toThrow(types_1.ObjectError);
  });
  test("Add an additional property", () => {
    expect(() => {
      safebox.set(["loved"], true);
    }).not.toThrow();
  });
  test("Delete hat", () => {
    expect(() => {
      agent.delete(["hat"]);
    }).not.toThrow();
  });
  test("Check final result", () => {
    expect(agent.get()).toEqual({
      name: "Dan",
      age: 32,
      children: ["Stephen"],
      loved: true
    });
  });
});
//# sourceMappingURL=integration.test.js.map