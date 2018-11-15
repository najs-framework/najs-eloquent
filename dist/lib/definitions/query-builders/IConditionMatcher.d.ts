declare namespace NajsEloquent.QueryBuilder {
    type GroupQueryConditionData = {
        bool: 'and' | 'or';
        queries: Array<SingleQueryConditionData | GroupQueryConditionData>;
    };
    type SingleQueryConditionData = {
        bool: 'and' | 'or';
        field: string;
        operator: QueryGrammar.Operator;
        value: any;
    };
    interface IConditionMatcher<T> {
        isMatch(record: T): boolean;
    }
    interface IConditionMatcherFactory {
        make(data: SingleQueryConditionData): IConditionMatcher<any>;
        transform(matcher: IConditionMatcher<any>): any;
    }
}
