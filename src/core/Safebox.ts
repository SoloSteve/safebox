import {toPath} from 'lodash';

import ISafeboxMemory from "./ISafeboxMemory";
import Validation from "./features/Validation";

import {AccessStatusCode, Permission, Access, SafeboxConfiguration} from "./types";

export default class Safebox {
  private readonly memory: ISafeboxMemory;
  private readonly validator: Validation;

  constructor(memory: ISafeboxMemory, config: SafeboxConfiguration) {
    this.memory = memory;
    this.validator = new Validation(config.schema);
  }

  get(path: string, permission: Permission): Access {
    const pathSegments = toPath(path);
    if (!this.memory.doesExist(pathSegments)) {
      return {value: null, status: AccessStatusCode.INVALID_PATH}
    }


    return this.memory.get(pathSegments);
  }
}