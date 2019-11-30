export default interface ISafeboxMemory {
  set(path: string[], value: any): void;
  doesExist(path: string[]): boolean;
  get(path?: string[]): any
}