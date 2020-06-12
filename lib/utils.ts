import {get as _get, isObjectLike, merge as _merge, setWith as _setWith} from "lodash";
import {Path} from "./types";

export function get(obj: any, path: Path, defaultValue?: any) {
  if (path.length === 0) {
    return obj;
  } else {
    return _get(obj, path, defaultValue);
  }
}

export function set(obj: any, path: Path, value: any) {
  if (path.length === 0) {
    Object.assign(obj, value);
  } else {
    _setWith(obj, path, value, Object);
  }
}

/**
 * Returns the merged object or value
 */
export function merge(source: any, addition: any): any {
  if (isObjectLike(addition) && isObjectLike(source)) {
    return _merge(source, addition);
  } else {
    return addition;
  }
}