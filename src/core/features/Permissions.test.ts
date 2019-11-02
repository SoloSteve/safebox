import Permission from "./Permission";
import {PathPermissionType} from "../types";

test('Creates the permission tree correctly', () => {
  const permission = new Permission([
    {path: ['a', 'b', 'c'], pathPermissionTypes: new Set([PathPermissionType.READ])},
    {path: ['a', 'b', 'c', 'd'], pathPermissionTypes: new Set([PathPermissionType.NO_READ])},
    {path: ['e', 'f'], pathPermissionTypes: new Set([PathPermissionType.READ])}
  ]);
  // @ts-ignore
  expect(permission.permissionTree).toEqual({
    a: {
      b: {
        c: {
          // @ts-ignore
          [Permission.permissionTypesSymbol]: new Set([PathPermissionType.READ]),
          d: {
            // @ts-ignore
            [Permission.permissionTypesSymbol]: new Set([PathPermissionType.NO_READ])
          }
        }
      }
    },
    e: {
      f: {
        // @ts-ignore
        [Permission.permissionTypesSymbol]: new Set([PathPermissionType.READ]),
      }
    }
  });
});