const benchmark = require("nodemark");

import {Permit} from "../lib/permission/permit";
import {PathPermission, PermissionType} from "../lib/permission/path_permission";


describe("Permission Tree Creation", () => {
  test("Single permission type tree creation", () => {
    const permit = new Permit();
    permit.addPermissions(
      new PathPermission(["1", "2", "3"]),
      new PathPermission(["1", "4", "5"], PermissionType.GET),
      new PathPermission(["1", "4", "5", "6"], PermissionType.GET),
      new PathPermission(["1", "4", "5", "7"]),
      new PathPermission(["1", "4", "8"]),
      new PathPermission(["1", "9", "10"]),
      new PathPermission(["1", "9", "11"]),
    );
    // @ts-ignore
    expect(permit.permissionTree).toEqual({
      1: {
        2: {
          3: {
            // @ts-ignore
            [Permit.PERMISSIONS_KEY]: new PathPermission(["1", "2", "3"]),
          }
        },
        4: {
          5: {
            // @ts-ignore
            [Permit.PERMISSIONS_KEY]: new PathPermission(["1", "4", "5"], PermissionType.GET),
            6: {
              // @ts-ignore
              [Permit.PERMISSIONS_KEY]: new PathPermission(["1", "4", "5", "6"], PermissionType.GET),
            },
            7: {
              // @ts-ignore
              [Permit.PERMISSIONS_KEY]: new PathPermission(["1", "4", "5", "7"]),
            }
          },
          8: {
            // @ts-ignore
            [Permit.PERMISSIONS_KEY]: new PathPermission(["1", "4", "8"]),
          }
        },
        9: {
          10: {
            // @ts-ignore
            [Permit.PERMISSIONS_KEY]: new PathPermission(["1", "9", "10"]),
          },
          11: {
            // @ts-ignore
            [Permit.PERMISSIONS_KEY]: new PathPermission(["1", "9", "11"]),
          }
        }
      }
    });
  });
  test("Check no overrides in tree", () => {
    const permit = new Permit(
      new PathPermission(["a", "b"], PermissionType.MUTATE),
      new PathPermission(["a"], PermissionType.GET)
    );
    // @ts-ignore
    expect(permit.permissionTree).toEqual({
      a: {
        // @ts-ignore
        [Permit.PERMISSIONS_KEY]: new PathPermission(["a"], PermissionType.GET),
        b: {
          // @ts-ignore
          [Permit.PERMISSIONS_KEY]: new PathPermission(["a", "b"], PermissionType.MUTATE),
        }
      }
    })
  })
});

describe("Single Type Tree Permission Access", () => {
  function makeTest(first: PermissionType, second: PermissionType, third: PermissionType, other: PermissionType) {
    test(`Test: [${first}, ${second}, ${third}]`, () => {
      // Create Permit
      const permit = new Permit();
      permit.addPermissions(
        new PathPermission(["1"], first),
        new PathPermission(["1", "2"], second),
        new PathPermission(["1", "3"], third),
      );


      expect(
        permit.getConflicts(second, ["1", "2"], true)
      ).toEqual([]);

      expect(
        permit.getConflicts(third, ["1", "3"], true)
      ).toEqual([]);

      expect(
        permit.getConflicts(first, ["1"], {
          2: true,
          3: true
        }).sort()
      ).toEqual((() => {
        let problems = [];
        if (first !== second) problems.push(["1", "2"]);
        if (first !== third) problems.push(["1", "3"]);
        return problems.sort();
      })());

      expect(
        permit.getConflicts(first, [], {
          1: {
            2: true,
            3: true
          }
        }).sort()
      ).toEqual((() => {
        let problems = [];
        if (first !== second) problems.push(["1", "2"]);
        if (first !== third) problems.push(["1", "3"]);
        return problems.sort();
      })());

      expect(
        permit.getConflicts(other, ["1"], {
          2: true,
          3: true,
        }).sort()
      ).toEqual([["1", "2"], ["1", "3"]].sort());

      expect(
        permit.getConflicts(other, ["1", "2"], true).sort()
      ).toEqual([["1", "2"]].sort());

      expect(
        permit.getConflicts(first, ["1"], {
          2: true,
          3: true,
          x: true
        })
      ).toEqual((() => {
        let problems = [];
        if (first !== second) problems.push(["1", "2"]);
        if (first !== third) problems.push(["1", "3"]);
        return problems;
      })());

      expect(
        permit.getConflicts(other, ["1"], {
          2: true,
          3: true,
          x: true
        }).sort()
      ).toEqual([["1", "x"], ["1", "2"], ["1", "3"]].sort());

      expect(
        permit.getConflicts(third, ["1"], {
          2: true,
          3: {
            x: true,
            y: true,
          },
        }).sort()
      ).toEqual((() => {
        let problems = [];
        if (third !== second) problems.push(["1", "2"]);
        return problems.sort();
      })());

      expect(
        permit.getConflicts(other, ["1"], {
          2: true,
          3: {
            x: true,
            y: true,
          },
        }).sort()
      ).toEqual([["1", "3", "x"], ["1", "3", "y"], ["1", "2"]].sort());
    });
  }

  makeTest(PermissionType.MUTATE, PermissionType.MUTATE, PermissionType.MUTATE, PermissionType.CREATE);
  makeTest(PermissionType.MUTATE, PermissionType.CREATE, PermissionType.MUTATE, PermissionType.GET);
  makeTest(PermissionType.CREATE, PermissionType.MUTATE, PermissionType.MUTATE, PermissionType.GET);
});

describe("Integration Test", () => {
  const permit = new Permit();
  permit.addPermissions(
    new PathPermission(["1", "2", "3"]),
    new PathPermission(["1", "4", "5"], PermissionType.GET),
    new PathPermission(["1", "4", "5", "6"], PermissionType.GET),
    new PathPermission(["1", "4", "5", "7"]),
    new PathPermission(["1", "4", "8"]),
    new PathPermission(["1", "9", "10"]),
    new PathPermission(["1", "9", "11"]),
    new PathPermission(["1", "12"]),
    new PathPermission(["1", "12", "13"], PermissionType.GET),
    new PathPermission(["1", "12", "14"], PermissionType.GET),
  );

  const valueAtPath = {
    1: {
      2: {
        3: true
      },
      4: {
        5: {
          6: true,
          7: true
        },
        8: true
      },
      9: {
        10: true,
        11: true
      },
      12: {
        x: true,
        13: {
          x: true
        },
        14: true
      }
    }
  };

  const preset = () => {
    return permit.getConflicts(PermissionType.GET, [], valueAtPath);
  };

  test("Get everything", () => {
    expect(preset().sort()).toEqual([
      ["1", "2", "3"],
      ["1", "4", "8"],
      ["1", "4", "5", "7"],
      ["1", "9", "10"],
      ["1", "9", "11"],
      ["1", "12", "x"],
    ].sort());
  });

  test("Benchmark Get Everything", () => {
    // console.log(benchmark(preset));
    console.log(benchmark(() => {
      //@ts-ignore
      permit.getLeafPaths(valueAtPath, []);
    }))
  });
});