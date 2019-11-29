import Permission from "./permission";
import {PathAction, PathPermission} from "../../types";


test("Creates the permission tree correctly", () => {
  const permission = new Permission([
    {path: ['a', 'b', 'c'], pathPermissionTypes: new Set([PathPermission.CAN_GET])},
    {path: ['a', 'b', 'c', 'd'], pathPermissionTypes: new Set([PathPermission.NO_GET])},
    {path: ['e', 'f'], pathPermissionTypes: new Set([PathPermission.CAN_GET])},
    {path: [], pathPermissionTypes: new Set([PathPermission.NO_SET])}
  ]);
  // @ts-ignore
  expect(permission.permissionTree).toEqual({
    // @ts-ignore
    [Permission.PERMISSIONS_KEY]: new Set([PathPermission.NO_SET]),
    a: {
      b: {
        c: {
          // @ts-ignore
          [Permission.PERMISSIONS_KEY]: new Set([PathPermission.CAN_GET]),
          d: {
            // @ts-ignore
            [Permission.PERMISSIONS_KEY]: new Set([PathPermission.NO_GET])
          }
        }
      }
    },
    e: {
      f: {
        // @ts-ignore
        [Permission.PERMISSIONS_KEY]: new Set([PathPermission.CAN_GET]),
      }
    }
  });
});

describe("Test Permissions", () => {
  test("Single permission Rule", () => {
    const permission = new Permission([
      {path: ['a', 'b'], pathPermissionTypes: new Set([PathPermission.CAN_GET])}
    ]);
    expect(permission.hasPermission(['a', 'b'], 0, PathAction.GET)).toBe(true);
  });

  test("Multiple permission Rules", () => {
    const permission = new Permission([
      {path: ['a', 'b'], pathPermissionTypes: new Set([PathPermission.CAN_SET])},
      {path: ['a', 'b2', 'c'], pathPermissionTypes: new Set([PathPermission.CAN_GET, PathPermission.NO_SET])}
    ]);
    expect(permission.hasPermission(['a', 'b2', 'c'], 0, PathAction.GET)).toBe(true);
  });

  test("permission Changed Mid-Path", () => {
    const permission = new Permission([
      {path: ['a', 'b'], pathPermissionTypes: new Set([PathPermission.CAN_GET])},
      {path: ['a', 'b2', 'c'], pathPermissionTypes: new Set([PathPermission.NO_GET, PathPermission.CAN_SET])}
    ]);
    expect(permission.hasPermission(['a', 'b2', 'c'], 0, PathAction.GET)).toBe(false);
  });

  test("No Rules", () => {
    const permission = new Permission([]);
    expect(permission.hasPermission(['a', 'b'], 0, PathAction.SET)).toBe(false);
  });

  test("Partial Path Rule", () => {
    const permission = new Permission([
      {path: ['a'], pathPermissionTypes: new Set([PathPermission.CAN_GET])},
    ]);
    expect(permission.hasPermission(['a', 'b', 'c'], 0, PathAction.GET)).toBe(true);
  });

  test("Path Continues In Value", () => {
    const permission = new Permission([
      {path: ['a'], pathPermissionTypes: new Set([PathPermission.NO_SET])},
      {path: ['a', 'b'], pathPermissionTypes: new Set([PathPermission.NO_GET])},
      {path: ['a', 'b', 'c'], pathPermissionTypes: new Set([PathPermission.CAN_GET])},
    ]);
    expect(permission.hasPermission(['a'], {b: {c: 0}}, PathAction.GET)).toBe(true);
  });
});

