import PermissionChecker from "./permission_checker";
import {PathAction} from "../../types";
import Permission from "./permission";


test("Creates the permission tree correctly", () => {
  const permission = new PermissionChecker([
    {path: ['a', 'b', 'c'], permissions: new Permission(PathAction.GET, PathAction.SET)},
    {path: ['a', 'b', 'c', 'd'], permissions: new Permission()},
    {path: ['e', 'f'], permissions: new Permission(PathAction.GET)},
    {path: ['g'], permissions: new Permission(PathAction.SET)},
    {path: [], permissions: new Permission()}
  ]);
  permission.checkPermission(PathAction.GET, ['a', 'b', 'c']);
  // @ts-ignore
  expect(permission.permissionTree).toEqual({
    // @ts-ignore
    [PermissionChecker.PERMISSIONS_KEY]: new Permission(),
    a: {
      b: {
        c: {
          // @ts-ignore
          [PermissionChecker.PERMISSIONS_KEY]: new Permission(PathAction.GET, PathAction.SET),
          d: {
            // @ts-ignore
            [PermissionChecker.PERMISSIONS_KEY]: new Permission()
          }
        }
      }
    },
    e: {
      f: {
        // @ts-ignore
        [PermissionChecker.PERMISSIONS_KEY]: new Permission(PathAction.GET),
      }
    },
    g: {
      // @ts-ignore
      [PermissionChecker.PERMISSIONS_KEY]: new Permission(PathAction.SET),
    }
  });

});
