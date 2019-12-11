import Safebox from "./safebox";
import SafeboxLocalMemory from "../memory/safebox_local_memory";
import Permission from "./features/permission/permission";
import {AccessStatusCode, PathAction} from "./types";
import PermissionChecker from "./features/permission/permission_checker";

describe("Integration Test", () => {
  const safebox = new Safebox(new SafeboxLocalMemory(), {
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
      {path: [], permissions: new Permission(PathAction.GET, PathAction.SET)}
    ]
  });

  test("Setting the template", () => {
    expect(safebox.set({
      users: [],
    })).toEqual({
      status: AccessStatusCode.SUCCESS
    });

    // @ts-ignore
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
    }, ["users", "0"], new PermissionChecker([
      {path: [], permissions: new Permission(PathAction.GET, PathAction.SET)},
      {path: ["users", "0", "id"], permissions: new Permission()},
    ]))).toEqual({
      status: AccessStatusCode.PERMISSION_DENIED
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
      status: AccessStatusCode.SUCCESS
    });

    // @ts-ignore
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
    // @ts-ignore
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

    expect(safebox.get(undefined, true, new PermissionChecker([
      {path: [], permissions: new Permission(PathAction.GET, PathAction.SET)},
      {path: ["users", "0", "id"], permissions: new Permission()}
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