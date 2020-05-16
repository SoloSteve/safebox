import { JSONSchema4 } from "json-schema";
import { Path } from "../types";
export declare type SchemaKeywordHandlerCollection = {
    [key: string]: SchemaKeywordHandler;
};
export declare type SchemaKeywordHandler = (schema: JSONSchema4, pathSegment: string) => Path | false;
export declare const SCHEMA_KEYWORD_HANDLERS: SchemaKeywordHandlerCollection;
