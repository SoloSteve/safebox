import PermissionChecker from "./permission_checker";
import {PathAction} from "../../types";
import Permission from "./permission";


describe("Check Permissions", () => {
  const permission = new PermissionChecker([
    {path: [], permissions: new Permission()},
    {path: ["root"], permissions: new Permission(PathAction.GET)},
    {path: ["metadata"], permissions: new Permission()},
    {path: ["root", "readable"], permissions: new Permission(PathAction.GET)},
    {path: ["root", "read_and_write"], permissions: new Permission(PathAction.GET, PathAction.SET)},
    {path: ["root", "read_and_write", "only_write"], permissions: new Permission(PathAction.SET)},
    {path: ["root", "readable", "my_space"], permissions: new Permission(PathAction.SET, PathAction.GET)},
    {path: ["root", "readable", "my_space", "id"], permissions: new Permission(PathAction.GET)},
    {path: ["root", "readable", "my_space", "inner", "inner2"], permissions: new Permission()},
  ]);

  test("Creates the permission tree correctly", () => {
    // @ts-ignore
    expect(permission.permissionTree).toEqual({
      // @ts-ignore
      [PermissionChecker.PERMISSIONS_KEY]: new Permission(),
      root: {
        // @ts-ignore
        [PermissionChecker.PERMISSIONS_KEY]: new Permission(PathAction.GET),
        readable: {
          // @ts-ignore
          [PermissionChecker.PERMISSIONS_KEY]: new Permission(PathAction.GET),
          my_space: {
            // @ts-ignore
            [PermissionChecker.PERMISSIONS_KEY]: new Permission(PathAction.GET, PathAction.SET),
            id: {
              // @ts-ignore
              [PermissionChecker.PERMISSIONS_KEY]: new Permission(PathAction.GET),
            },
            inner: {
              inner2: {
                // @ts-ignore
                [PermissionChecker.PERMISSIONS_KEY]: new Permission(),
              }
            }
          }
        },
        read_and_write: {
          // @ts-ignore
          [PermissionChecker.PERMISSIONS_KEY]: new Permission(PathAction.GET, PathAction.SET),
          only_write: {
            // @ts-ignore
            [PermissionChecker.PERMISSIONS_KEY]: new Permission(PathAction.SET),
          }
        }
      },
      metadata: {
        // @ts-ignore
        [PermissionChecker.PERMISSIONS_KEY]: new Permission(),
      }
    });
  });
  test("Root level no get", () => {
    expect(permission.checkPermission(PathAction.GET, ["metadata"], 99)).toEqual({
      hasPermission: false, problems: [
        ["metadata"]
      ]
    });
  });
  test("Root level no set", () => {
    expect(permission.checkPermission(PathAction.SET, ["metadata"], 99)).toEqual({
      hasPermission: false, problems: [
        ["metadata"]
      ]
    });
  });
  test("Get with problem", () => {
    expect(permission.checkPermission(PathAction.GET, ["root", "readable"])).toEqual({
      hasPermission: false, problems: [
        ["root", "readable", "my_space", "inner", "inner2"]
      ]
    });
  });
  test("Get with multiple problems", () => {
    expect(permission.checkPermission(PathAction.GET, ["root"]).problems).toEqual(expect.arrayContaining(
      [
        ["root", "readable", "my_space", "inner", "inner2"],
        ["root", "read_and_write", "only_write"]
      ]));
  });
  test("No root permissions", () => {
    expect(permission.checkPermission(PathAction.GET, [])).toEqual({
      hasPermission: false,
      problems: [
        []
      ]
    })
  });
  test("Set single value", () => {
    expect(permission.checkPermission(PathAction.SET, ["root", "read_and_write", "only_write"], 99)).toEqual({
      hasPermission: true,
      problems: []
    });
  });
  test("Set complex value", () => {
    expect(permission.checkPermission(PathAction.SET, ["root", "read_and_write"], {
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
    expect(permission.checkPermission(PathAction.SET, ["root", "readable", "my_space"], {
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
    expect(permission.checkPermission(PathAction.SET, ["root", "read_and_write"], {
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
