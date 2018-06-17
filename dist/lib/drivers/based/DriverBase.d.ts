export declare abstract class DriverBase<T> {
    static GlobalEventEmitter: Najs.Contracts.Event.AsyncEventEmitter;
    protected attributes: T;
    protected modelName: string;
    protected eventEmitter?: Najs.Contracts.Event.AsyncEventEmitter;
    protected softDeletesSetting?: NajsEloquent.Model.ISoftDeletesSetting;
    abstract getAttribute(path: string): any;
    abstract setAttribute(path: string, value: any): boolean;
    getRecord(): T;
    setRecord(value: T): void;
    proxify(type: 'get' | 'set', target: any, key: string, value?: any): any;
    useEloquentProxy(): boolean;
    formatAttributeName(name: string): string;
    formatRecordName(): string;
    isSoftDeleted(): boolean;
    getModelComponentName(): string | undefined;
    getModelComponentOrder(components: string[]): string[];
    getEventEmitter(global: boolean): Najs.Contracts.Event.AsyncEventEmitter;
}
