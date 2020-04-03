import {KeywordHandler} from "../../types";

export const keywordHandlers: { [key: string]: KeywordHandler } = {
  "properties": (schema, key) => {
    if (
      schema.hasOwnProperty("properties")
      && schema["properties"].hasOwnProperty(key)
    ) {
      return ["properties", key];
    }
    return false;
  },
  "items": (schema, key) => {
    if (Number.isInteger(parseInt(key))) {
      return ["items"];
    }
    return false;
  }
};