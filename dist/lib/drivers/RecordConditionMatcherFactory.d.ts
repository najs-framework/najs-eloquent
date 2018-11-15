/// <reference path="../definitions/query-builders/IConditionMatcher.d.ts" />
import IConditionMatcherFactory = NajsEloquent.QueryBuilder.IConditionMatcherFactory;
import SingleQueryConditionData = NajsEloquent.QueryBuilder.SingleQueryConditionData;
import { RecordConditionMatcher } from './RecordConditionMatcher';
export declare class RecordConditionMatcherFactory implements IConditionMatcherFactory {
    static className: string;
    getClassName(): string;
    make(data: SingleQueryConditionData): RecordConditionMatcher;
    transform(matcher: RecordConditionMatcher): RecordConditionMatcher;
}
