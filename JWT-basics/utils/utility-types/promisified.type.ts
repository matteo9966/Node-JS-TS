type genericFunction = (...args: any) => any;
export type Promisified<T extends genericFunction> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;
