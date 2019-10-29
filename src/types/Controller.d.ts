/* tslint:disable:no-any */

export type ControllerFunction<T = any> = (arg?: T) => Promise<T>;
