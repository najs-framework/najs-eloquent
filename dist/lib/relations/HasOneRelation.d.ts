import { Eloquent } from '../model/Eloquent';
export declare class HasOneRelation<T> {
    protected loaded: boolean;
    protected foreign?: Eloquent<any>;
    protected foreignModel: string;
    protected foreignKey: string;
    protected localModel: string;
    protected localKey: string;
    protected local?: Eloquent<any>;
    constructor(localModel: string, foreignModel: string, localKey: string, foreignKey: string);
    setLocal(local: Eloquent<any>): void;
    setForeign(foreign: Eloquent<any>): void;
    isLoaded(): boolean;
    load(): Promise<T>;
    getModelByName(name: string): Eloquent<any>;
}
