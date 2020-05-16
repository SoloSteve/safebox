import {get as _get, setWith as _setWith} from "lodash";
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