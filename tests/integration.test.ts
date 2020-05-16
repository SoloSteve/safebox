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
      children: {
        type: "array",
        items: {
          type: "string"
        }
      }
    }
  }, new LocalMemory(), {name: "Bob", age: 32, children: []});

  const agent = safebox.getAgent(
    new PathPermission([], PermissionType.GET, PermissionType.MUTATE),
    new PathPermission(["age"], PermissionType.GET),
    new PathPermission(["children"], PermissionType.GET, PermissionType.CREATE, PermissionType.MUTATE)
  );

  test("Get Bob", () => {
    expect(agent.get()).toEqual({name: "Bob", age: 32, children: []});
  });

  test("Get Bob's name", () => {
    expect(agent.get(["name"])).toEqual("Bob");
  });

  test("Add child to Bob", () => {
    expect(() => {
      agent.create(["children", "0"], "Steve")
    }).not.toThrow();
  });

  test("Try to add another first child", () => {
    expect(() => {
      agent.create(["children", "0"], "Stephen")
    }).toThrow(ObjectError);
  });

  test("Try to mutate Bob's properties", () => {
    expect(() => {
      agent.mutate(["name"], "Dan")
    }).not.toThrow();
    expect(() => {
      agent.mutate(["age"], "Dan")
    }).toThrow(PermissionDeniedError);
  });

  test("Try to make name a number", () => {
    expect(() => {
      agent.mutate(["name"], 101)
    }).toThrow(ValidationError);
  });

  test("Try to add another property", () => {
    expect(() => {
      agent.create(["State"], "California")
    }).toThrow(PermissionDeniedError);
  });

  test("Check final result", () => {
    expect(agent.get()).toEqual({
      name: "Dan",
      age: 32,
      children: ["Steve"]
    })
  });
});