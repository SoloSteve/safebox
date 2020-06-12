import {Safebox} from "../lib/safebox";
import {LocalMemory} from "../memory/local_memory";
import {PathPermission, PermissionType} from "../lib/permission/path_permission";
import {ObjectError, PermissionDeniedError, ValidationError} from "../lib/types";

describe("Normal Flow", () => {
  const safebox = new Safebox({
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
    }
  }, new LocalMemory(), {name: "Bob", age: 32, hat: true, children: []});

  const agent = safebox.getAgent(
    new PathPermission([], PermissionType.GET, PermissionType.SET),
    new PathPermission(["age"], PermissionType.GET),
    new PathPermission(["hat"], PermissionType.SET, PermissionType.GET, PermissionType.DELETE),
    new PathPermission(["children"], PermissionType.GET, PermissionType.SET, PermissionType.DELETE)
  );

  test("Get Bob", () => {
    expect(agent.get()).toEqual({name: "Bob", age: 32, hat: true, children: []});
  });

  test("Get Bob's name", () => {
    expect(agent.get(["name"])).toEqual("Bob");
  });

  test("Add child to Bob", () => {
    expect(() => {
      agent.set(["children", "0"], "Steve")
    }).not.toThrow();
  });

  test("Try to add another first child", () => {
    expect(() => {
      agent.set(["children", "0"], "Stephen")
    }).not.toThrow();
  });

  test("Try to mutate Bob's properties", () => {
    expect(() => {
      agent.merge(["name"], "Dan");
    }).not.toThrow();
    expect(() => {
      agent.set(["age"], "Dan")
    }).toThrow(PermissionDeniedError);
  });

  test("Try to make name a number", () => {
    expect(() => {
      agent.set(["name"], 101)
    }).toThrow(ValidationError);
  });

  test("Try to add another property", () => {
    expect(() => {
      agent.set(["State"], "California")
    }).toThrow(ValidationError);
  });

  test("Try to add deep property", () => {
    expect(() => {
      safebox.set(["something", "that", "doesn't", "exist"], 0);
    }).toThrow(ValidationError);
  });

  test("Try to delete unknown object", () => {
    expect(() => {
      agent.delete(["children", "1"]);
      agent.delete(["age", "quantum"]);
    }).toThrow(ObjectError);
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
      children: ["Stephen"]
    })
  });
});