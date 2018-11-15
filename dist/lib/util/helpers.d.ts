import { Model } from '../model/Model';
export declare function isModel(value: any): boolean;
export declare function isObjectId(value: any): boolean;
export declare function isCollection(value: any): boolean;
export declare function distinctModelByClassInCollection(collection: CollectJs.Collection<Model>): Model[];
