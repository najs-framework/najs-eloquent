/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/query-builders/IQueryBuilder.d.ts" />
/// <reference path="../definitions/query-builders/IQueryBuilderFactory.d.ts" />
/// <reference path="../definitions/features/IQueryFeature.d.ts" />
import { FeatureBase } from './FeatureBase';
export declare class QueryFeature extends FeatureBase implements NajsEloquent.Feature.IQueryFeature {
    protected factory: NajsEloquent.QueryBuilder.IQueryBuilderFactory;
    constructor(factory: NajsEloquent.QueryBuilder.IQueryBuilderFactory);
    getPublicApi(): object | undefined;
    getFeatureName(): string;
    getClassName(): string;
    newQuery(model: NajsEloquent.Model.IModel): NajsEloquent.QueryBuilder.IQueryBuilder<any>;
}
