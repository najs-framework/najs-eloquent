/// <reference path="../../definitions/model/IModel.d.ts" />
import IModel = NajsEloquent.Model.IModel;
import { QueryBuilder } from '../../query-builders/QueryBuilder';
import { MemoryQueryBuilderHandler } from './MemoryQueryBuilderHandler';
export declare class MemoryQueryBuilder<T extends IModel, H extends MemoryQueryBuilderHandler = MemoryQueryBuilderHandler> extends QueryBuilder<T, H> {
}
