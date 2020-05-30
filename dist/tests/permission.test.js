"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const benchmark = require("nodemark");
const permit_1 = require("../lib/permission/permit");
const path_permission_1 = require("../lib/permission/path_permission");
describe("Permission Tree Creation", () => {
    test("Single permission type tree creation", () => {
        const permit = new permit_1.Permit();
        permit.addPermissions(new path_permission_1.PathPermission(["1", "2", "3"]), new path_permission_1.PathPermission(["1", "4", "5"], path_permission_1.PermissionType.GET), new path_permission_1.PathPermission(["1", "4", "5", "6"], path_permission_1.PermissionType.GET), new path_permission_1.PathPermission(["1", "4", "5", "7"]), new path_permission_1.PathPermission(["1", "4", "8"]), new path_permission_1.PathPermission(["1", "9", "10"]), new path_permission_1.PathPermission(["1", "9", "11"]));
        expect(permit.permissionTree).toEqual({
            1: {
                2: {
                    3: {
                        [permit_1.Permit.PERMISSIONS_KEY]: new path_permission_1.PathPermission(["1", "2", "3"]),
                    }
                },
                4: {
                    5: {
                        [permit_1.Permit.PERMISSIONS_KEY]: new path_permission_1.PathPermission(["1", "4", "5"], path_permission_1.PermissionType.GET),
                        6: {
                            [permit_1.Permit.PERMISSIONS_KEY]: new path_permission_1.PathPermission(["1", "4", "5", "6"], path_permission_1.PermissionType.GET),
                        },
                        7: {
                            [permit_1.Permit.PERMISSIONS_KEY]: new path_permission_1.PathPermission(["1", "4", "5", "7"]),
                        }
                    },
                    8: {
                        [permit_1.Permit.PERMISSIONS_KEY]: new path_permission_1.PathPermission(["1", "4", "8"]),
                    }
                },
                9: {
                  10: {
                    [permit_1.Permit.PERMISSIONS_KEY]: new path_permission_1.PathPermission(["1", "9", "10"]),
                  },
                  11: {
                    [permit_1.Permit.PERMISSIONS_KEY]: new path_permission_1.PathPermission(["1", "9", "11"]),
                  }
                }
            }
        });
    });
  test("Check no overrides in tree", () => {
    const permit = new permit_1.Permit(new path_permission_1.PathPermission(["a", "b"], path_permission_1.PermissionType.MUTATE), new path_permission_1.PathPermission(["a"], path_permission_1.PermissionType.GET));
    expect(permit.permissionTree).toEqual({
      a: {
        [permit_1.Permit.PERMISSIONS_KEY]: new path_permission_1.PathPermission(["a"], path_permission_1.PermissionType.GET),
        b: {
          [permit_1.Permit.PERMISSIONS_KEY]: new path_permission_1.PathPermission(["a", "b"], path_permission_1.PermissionType.MUTATE),
        }
      }
    });
  });
});
describe("Single Type Tree Permission Access", () => {
    function makeTest(first, second, third, other) {
        test(`Test: [${first}, ${second}, ${third}]`, () => {
            const permit = new permit_1.Permit();
            permit.addPermissions(new path_permission_1.PathPermission(["1"], first), new path_permission_1.PathPermission(["1", "2"], second), new path_permission_1.PathPermission(["1", "3"], third));
            expect(permit.getConflicts(second, ["1", "2"], true)).toEqual([]);
            expect(permit.getConflicts(third, ["1", "3"], true)).toEqual([]);
            expect(permit.getConflicts(first, ["1"], {
                2: true,
                3: true
            }).sort()).toEqual((() => {
                let problems = [];
                if (first !== second)
                    problems.push(["1", "2"]);
                if (first !== third)
                    problems.push(["1", "3"]);
                return problems.sort();
            })());
            expect(permit.getConflicts(first, [], {
                1: {
                    2: true,
                    3: true
                }
            }).sort()).toEqual((() => {
                let problems = [];
                if (first !== second)
                    problems.push(["1", "2"]);
                if (first !== third)
                    problems.push(["1", "3"]);
                return problems.sort();
            })());
            expect(permit.getConflicts(other, ["1"], {
                2: true,
                3: true,
            }).sort()).toEqual([["1", "2"], ["1", "3"]].sort());
            expect(permit.getConflicts(other, ["1", "2"], true).sort()).toEqual([["1", "2"]].sort());
            expect(permit.getConflicts(first, ["1"], {
                2: true,
                3: true,
                x: true
            })).toEqual((() => {
                let problems = [];
                if (first !== second)
                    problems.push(["1", "2"]);
                if (first !== third)
                    problems.push(["1", "3"]);
                return problems;
            })());
            expect(permit.getConflicts(other, ["1"], {
                2: true,
                3: true,
                x: true
            }).sort()).toEqual([["1", "x"], ["1", "2"], ["1", "3"]].sort());
            expect(permit.getConflicts(third, ["1"], {
                2: true,
                3: {
                    x: true,
                    y: true,
                },
            }).sort()).toEqual((() => {
                let problems = [];
                if (third !== second)
                    problems.push(["1", "2"]);
                return problems.sort();
            })());
            expect(permit.getConflicts(other, ["1"], {
                2: true,
                3: {
                    x: true,
                    y: true,
                },
            }).sort()).toEqual([["1", "3", "x"], ["1", "3", "y"], ["1", "2"]].sort());
        });
    }
    makeTest(path_permission_1.PermissionType.MUTATE, path_permission_1.PermissionType.MUTATE, path_permission_1.PermissionType.MUTATE, path_permission_1.PermissionType.CREATE);
    makeTest(path_permission_1.PermissionType.MUTATE, path_permission_1.PermissionType.CREATE, path_permission_1.PermissionType.MUTATE, path_permission_1.PermissionType.GET);
    makeTest(path_permission_1.PermissionType.CREATE, path_permission_1.PermissionType.MUTATE, path_permission_1.PermissionType.MUTATE, path_permission_1.PermissionType.GET);
});
describe("Integration Test", () => {
    const permit = new permit_1.Permit();
    permit.addPermissions(new path_permission_1.PathPermission(["1", "2", "3"]), new path_permission_1.PathPermission(["1", "4", "5"], path_permission_1.PermissionType.GET), new path_permission_1.PathPermission(["1", "4", "5", "6"], path_permission_1.PermissionType.GET), new path_permission_1.PathPermission(["1", "4", "5", "7"]), new path_permission_1.PathPermission(["1", "4", "8"]), new path_permission_1.PathPermission(["1", "9", "10"]), new path_permission_1.PathPermission(["1", "9", "11"]), new path_permission_1.PathPermission(["1", "12"]), new path_permission_1.PathPermission(["1", "12", "13"], path_permission_1.PermissionType.GET), new path_permission_1.PathPermission(["1", "12", "14"], path_permission_1.PermissionType.GET));
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
        return permit.getConflicts(path_permission_1.PermissionType.GET, [], valueAtPath);
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
        console.log(benchmark(() => {
            permit.getLeafPaths(valueAtPath, []);
        }));
    });
});
//# sourceMappingURL=permission.test.js.map