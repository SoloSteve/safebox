import {PathAction} from "../../types";

export default class Permission {
  private allowedActions: Set<PathAction>;

  constructor(...allowedActions: PathAction[]) {
    this.allowedActions = new Set<PathAction>(allowedActions);
  }

  public canExecuteAction(action: PathAction): boolean {
    return this.allowedActions.has(action);
  }
}