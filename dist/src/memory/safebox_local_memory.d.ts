import { ISafeboxMemory } from "../core/isafebox_memory";
export declare class SafeboxLocalMemory implements ISafeboxMemory {
    private obj;
    constructor();
    doesExist(path: string[]): boolean;
    get(path?: string[]): any;
    set(path: string[], value: any): void;
}
