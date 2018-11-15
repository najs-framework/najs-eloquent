/// <reference path="../../../lib/definitions/collect.js/index.d.ts" />
export declare function make_collection(data: object): CollectJs.Collection<object>;
export declare function make_collection<T>(data: T[]): CollectJs.Collection<T>;
export declare function make_collection<T, R>(data: T[], converter: (item: T) => R): CollectJs.Collection<R>;
