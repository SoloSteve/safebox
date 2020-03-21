import Validation from "./validation";

describe("Check path converter", () => {
  const validator = new Validation({
    "type": "object",
    "properties": {
      "fruits": {
        "type": "array",
        "items": {
          "type": "string"
        },
      },
      "things": {
        "properties": {
          "nums": {
            "type": "integer",
          }
        }
      },
    }
  });

  test("Simple Property", () => {
    // @ts-ignore
    expect(validator.objectPathToSchemaPath(["things", "nums"]))
      .toStrictEqual(["properties", "things", "properties", "nums"]);
  });

  test("Array Items", () => {
    // @ts-ignore
    expect(validator.objectPathToSchemaPath(["fruits", "3"]))
      .toStrictEqual(["properties", "fruits", "items"])
  });
});

describe("Fast validation support checker", () => {
  test("Supported Schema", () => {
    const validator = new Validation({
      type: "object",
      properties: {
        "one": {
          type: "boolean"
        },
        "two": {
          type: "string"
        },
        'three': {
          type: "object",
          properties: {
            "four": {
              type: "number"
            }
          }
        }
      }
    });
    expect(validator.hasFastValidation).toBe(true);
  });

  test("Unsupported Schema", () => {
    const validator = new Validation({
      type: "object",
      additionalProperties: {
        "one": {
          type: "boolean"
        },
        "two": {
          type: "string"
        },
        'three': {
          type: "object",
          properties: {
            "four": {
              type: "number"
            }
          }
        }
      }
    });
    expect(validator.hasFastValidation).toBe(false);
    expect(() => validator.isValid([], null)).toThrow();
  });
});

describe("Check fast validation queries", () => {
  const validator = new Validation({
    type: "object",
    properties: {
      "memory": {
        type: "number"
      },
      "cpu": {
        type: "string"
      },
      "os": {
        type: "string"
      },
      "programs": {
        type: "array",
        items: {
          type: "string"
        }
      },
      "hardware": {
        type: "object",
        properties: {
          "keyboard": {
            type: "boolean"
          },
          "touch-pad": {
            type: "boolean"
          }
        }
      }
    }
  });

  test("Property Set", () => {
    expect(validator.isValid(["memory"], 3)).toBe(true);
  });

  test("Property Set 2", () => {
    expect(validator.isValid(["hardware", "touch-pad"], false)).toBe(true);
  });

  test("Array Set", () => {
    expect(validator.isValid(["programs", "2"], "Firefox")).toBe(true);
  });

  test("Invalid Property Set", () => {
    expect(validator.isValid(["hardware", "keyboard"], 4)).toBe(false);
  });

  test("Invalid Path", () => {
    expect(validator.isValid(["does", "not", "exist"], 1)).toBe(false);
  });

  test("Entire Object", () => {
    expect(validator.isValid([], {
      memory: 1024,
      cpu: "x86",
      os: "Linux",
      programs: [
        "bash",
        "cat",
        "grep"
      ],
      hardware: {
        keyboard: true,
        "touch-pad": false
      }
    })).toBe(true);
  });
});

describe("Check complete object validation queries", () => {
  const validator = new Validation({
    type: "object",
    properties: {
      "memory": {
        type: "number"
      },
      "cpu": {
        type: "string"
      },
      "os": {
        type: "string"
      },
      "programs": {
        type: "array",
        items: {
          type: "string"
        }
      },
      "hardware": {
        type: "object",
        properties: {
          "keyboard": {
            type: "boolean"
          },
          "touch-pad": {
            type: "boolean"
          }
        }
      }
    }
  });
  const obj = {
    memory: 1024,
    cpu: "x86",
    os: "Linux",
    programs: [
      "bash",
      "cat",
      "grep"
    ],
    hardware: {
      keyboard: true,
      "touch-pad": false
    }
  };
  test("Entire Object Is Valid", () => {
    expect(validator.isBoxValid(obj)).toBe(true);
  });

  test("Part of object is invalid", () => {
    // @ts-ignore
    obj.programs[2] = 9;
    expect(validator.isBoxValid(obj)).toBe(false);
  });
});