import Validation from "./validation";

describe("Check path converter", () => {
  const validator = new Validation({
    "$id": "https://example.com/arrays.schema.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "A representation of a person, company, organization, or place",
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
      "vegetables": {
        "type": "array",
        "items": {
          "type": "object",
          "required": ["veggieName", "veggieLike"],
          "properties": {
            "veggieName": {
              "type": "string",
              "description": "The name of the vegetable."
            },
            "veggieLike": {
              "type": "boolean",
              "description": "Do I like this vegetable?"
            }
          }
        }
      }
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