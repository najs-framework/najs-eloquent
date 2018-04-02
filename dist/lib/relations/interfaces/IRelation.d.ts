export interface IRelation<Result> {
    isLoaded(): boolean;
    load(): Promise<Result>;
}
