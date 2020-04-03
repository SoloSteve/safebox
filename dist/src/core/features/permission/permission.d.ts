import { PathAction } from "../../types";
export declare class Permission {
    private allowedActions;
    constructor(...allowedActions: PathAction[]);
    canExecuteAction(action: PathAction): boolean;
}
