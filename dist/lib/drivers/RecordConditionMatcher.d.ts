/// <reference path="../definitions/query-builders/IConditionMatcher.d.ts" />
import IConditionMatcher = NajsEloquent.QueryBuilder.IConditionMatcher;
import { Record } from './Record';
import { DataConditionMatcher } from '../data/DataConditionMatcher';
export declare class RecordConditionMatcher extends DataConditionMatcher<Record> implements IConditionMatcher<Record> {
    constructor(field: string, operator: string, value: any);
    toJSON(): object;
}
