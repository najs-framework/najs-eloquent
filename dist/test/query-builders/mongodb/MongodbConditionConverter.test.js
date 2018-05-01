"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const MongodbConditionConverter_1 = require("../../../lib/query-builders/mongodb/MongodbConditionConverter");
describe('MongodbConditionConverter', function () {
    it('implements IAutoload and returns "NajsEloquent.QueryBuilder.Mongodb.MongodbConditionConverter" as className', function () {
        const query = new MongodbConditionConverter_1.MongodbConditionConverter([]);
        expect(query.getClassName()).toEqual('NajsEloquent.QueryBuilder.Mongodb.MongodbConditionConverter');
    });
    describe('protected convertSimpleCondition()', function () {
        const equalsOperatorDataset = {
            'equals case #1': {
                input: { field: 'a', operator: '=', value: 1 },
                expected: { a: 1 }
            },
            'equals case #2': {
                input: { field: 'a', operator: '==', value: true },
                expected: { a: true }
            },
            'equals case #3': {
                input: { field: 'a', operator: '==', value: undefined },
                expected: {}
            },
            'equals case #4': {
                input: { field: 'something.field', operator: '==', value: 'value' },
                expected: { something: { field: 'value' } }
            }
        };
        const converter = new MongodbConditionConverter_1.MongodbConditionConverter([]);
        for (const name in equalsOperatorDataset) {
            it(name, function () {
                expect(converter['convertSimpleCondition'](equalsOperatorDataset[name].input)).toEqual(equalsOperatorDataset[name].expected);
            });
        }
        function make_the_other_operators_dataset(name, operator, alternate, mgOpt) {
            return {
                [name + ' case #1']: {
                    input: { field: 'a', operator: operator, value: 1 },
                    expected: { a: { [mgOpt]: 1 } }
                },
                [name + ' case #2']: {
                    input: { field: 'a', operator: alternate, value: true },
                    expected: { a: { [mgOpt]: true } }
                },
                [name + ' case #3']: {
                    input: { field: 'a', operator: operator, value: undefined },
                    expected: {}
                },
                [name + ' case #4']: {
                    input: { field: 'something.field', operator: alternate, value: 'value' },
                    expected: { something: { field: { [mgOpt]: 'value' } } }
                }
            };
        }
        function test_for_operator(operatorName, operator, alternate, mgOpt) {
            const dataset = make_the_other_operators_dataset(operatorName, operator, alternate, mgOpt);
            const converter = new MongodbConditionConverter_1.MongodbConditionConverter([]);
            for (const name in dataset) {
                it(name, function () {
                    expect(converter['convertSimpleCondition'](dataset[name].input)).toEqual(dataset[name].expected);
                });
            }
        }
        test_for_operator('not-equals', '!=', '<>', '$ne');
        test_for_operator('less than', '<', '<', '$lt');
        test_for_operator('less than or equal', '<=', '=<', '$lte');
        test_for_operator('great than', '>', '>', '$gt');
        test_for_operator('great than or equal', '>=', '=>', '$gte');
        test_for_operator('in', 'in', 'in', '$in');
        test_for_operator('not in', 'not-in', 'not-in', '$nin');
    });
    describe('protected convertGroupOfCondition()', function () {
        const dataset = {
            'empty group #and': {
                input: { bool: 'and', queries: [] },
                expected: {}
            },
            'empty group #or': {
                input: { bool: 'and', queries: [] },
                expected: {}
            },
            'single condition case #1': {
                input: {
                    bool: 'and',
                    queries: [{ field: 'a', operator: '=', value: 1 }]
                },
                expected: { a: 1 }
            },
            'single condition case #2': {
                input: {
                    bool: 'or',
                    queries: [{ field: 'a', operator: '<>', value: 1 }]
                },
                expected: { a: { $ne: 1 } }
            },
            'multiple conditions case #1: the result has 2 keys then group by operator': {
                input: {
                    bool: 'and',
                    queries: [
                        { bool: 'and', field: 'a', operator: '=', value: 1 },
                        { bool: 'and', field: 'b', operator: '<>', value: 2 }
                    ]
                },
                expected: { $and: [{ a: 1, b: { $ne: 2 } }] }
            },
            'multiple conditions case #2: the result has 3 keys then group by operator': {
                input: {
                    bool: 'or',
                    queries: [
                        { bool: 'or', field: 'a', operator: '=', value: 1 },
                        { bool: 'or', field: 'b', operator: '<>', value: 2 },
                        { bool: 'or', field: 'c', operator: '<', value: 3 }
                    ]
                },
                expected: { $or: [{ a: 1 }, { b: { $ne: 2 } }, { c: { $lt: 3 } }] }
            },
            'multiple conditions case #3: result same field difference operator, group by operator': {
                input: {
                    bool: 'and',
                    queries: [
                        { bool: 'and', field: 'a', operator: '=', value: 1 },
                        { bool: 'and', field: 'a', operator: '<>', value: 2 }
                    ]
                },
                expected: { $and: [{ a: 1 }, { a: { $ne: 2 } }] }
            },
            'multiple conditions case #4: result has no key return {}': {
                input: {
                    bool: 'and',
                    queries: [
                        { bool: 'and', field: 'a', operator: '=', value: undefined },
                        { bool: 'and', field: 'a', operator: '<>', value: undefined }
                    ]
                },
                expected: {}
            },
            'multiple levels case #1: group an empty group': {
                input: {
                    bool: 'and',
                    queries: [
                        {
                            bool: 'and',
                            queries: []
                        }
                    ]
                },
                expected: {}
            },
            'multiple levels case #2: group 1 key group': {
                input: {
                    bool: 'and',
                    queries: [
                        {
                            bool: 'and',
                            queries: [{ field: 'a', operator: '=', value: 1 }]
                        }
                    ]
                },
                expected: { a: 1 }
            },
            'multiple levels case #3: group 2 keys group': {
                input: {
                    bool: 'and',
                    queries: [
                        {
                            bool: 'and',
                            queries: [
                                { bool: 'and', field: 'a', operator: '=', value: 1 },
                                { bool: 'and', field: 'b', operator: '=', value: 2 }
                            ]
                        }
                    ]
                },
                expected: { $and: [{ a: 1, b: 2 }] }
            },
            'multiple levels case #4: group 2 keys but they are same after converted': {
                input: {
                    bool: 'and',
                    queries: [
                        {
                            bool: 'and',
                            queries: [
                                { bool: 'and', field: 'a', operator: '=', value: 1 },
                                { bool: 'and', field: 'a', operator: '=', value: 2 }
                            ]
                        }
                    ]
                },
                expected: { $and: [{ a: 1 }, { a: 2 }] }
            },
            'multiple levels case #5: group inside group': {
                input: {
                    bool: 'or',
                    queries: [
                        { bool: 'or', field: 'a', operator: '=', value: 1 },
                        { bool: 'or', field: 'b', operator: '=', value: 2 },
                        {
                            bool: 'and',
                            queries: [
                                { bool: 'and', field: 'c', operator: '=', value: 3 },
                                { bool: 'and', field: 'd', operator: '=', value: 4 }
                            ]
                        }
                    ]
                },
                expected: { $or: [{ $or: [{ a: 1 }, { b: 2 }], $and: [{ c: 3, d: 4 }] }] }
            },
            'multiple operators case #1': {
                input: {
                    bool: 'or',
                    queries: [
                        { bool: 'and', field: 'a', operator: '=', value: 1 },
                        { bool: 'and', field: 'b', operator: '=', value: 2 },
                        { bool: 'and', field: 'c', operator: '=', value: 3 },
                        { bool: 'or', field: 'd', operator: '=', value: 4 }
                    ]
                },
                expected: { $or: [{ $and: [{ a: 1, b: 2 }], $or: [{ c: 3 }, { d: 4 }] }] }
            }
        };
        const converter = new MongodbConditionConverter_1.MongodbConditionConverter([]);
        for (const name in dataset) {
            it(name, function () {
                expect(converter['convertGroupOfCondition'](dataset[name].input)).toEqual(dataset[name].expected);
            });
        }
    });
    describe('protected convertConditions()', function () {
        const dataset = {
            'case "query.where(a)': {
                input: [{ bool: 'and', field: 'a', operator: '=', value: 1 }],
                expected: {
                    a: 1
                }
            },
            'case "query.where(a).where(a)': {
                input: [
                    { bool: 'and', field: 'a', operator: '>=', value: 1 },
                    { bool: 'and', field: 'a', operator: '<=', value: 10 }
                ],
                expected: {
                    $and: [{ a: { $gte: 1 } }, { a: { $lte: 10 } }]
                }
            },
            'case "query.orWhere(a).where(b)': {
                input: [
                    { bool: 'or', field: 'a', operator: '=', value: 1 },
                    { bool: 'and', field: 'b', operator: '=', value: 2 }
                ],
                expected: {
                    a: 1,
                    b: 2
                }
            },
            'case "query.where(a).where(b)': {
                input: [
                    { bool: 'and', field: 'a', operator: '=', value: 1 },
                    { bool: 'and', field: 'b', operator: '=', value: 2 }
                ],
                expected: {
                    a: 1,
                    b: 2
                }
            },
            'case "query.where(a).orWhere(b)': {
                input: [
                    { bool: 'and', field: 'a', operator: '=', value: 1 },
                    { bool: 'or', field: 'b', operator: '=', value: 2 }
                ],
                expected: {
                    $or: [{ a: 1 }, { b: 2 }]
                }
            },
            'case "query.where(a).where(b).where(c)"': {
                input: [
                    { bool: 'and', field: 'a', operator: '=', value: 1 },
                    { bool: 'and', field: 'b', operator: '<', value: 2 },
                    { bool: 'and', field: 'c', operator: '>', value: 3 }
                ],
                expected: {
                    a: 1,
                    b: { $lt: 2 },
                    c: { $gt: 3 }
                }
            },
            'case "query.where(a).orWhere(b).orWhere(c)"': {
                input: [
                    { bool: 'and', field: 'a', operator: '=', value: 1 },
                    { bool: 'or', field: 'b', operator: '<', value: 2 },
                    { bool: 'or', field: 'c', operator: '>', value: 3 }
                ],
                expected: {
                    $or: [{ a: 1 }, { b: { $lt: 2 } }, { c: { $gt: 3 } }]
                }
            },
            'case "query.orWhere(a).where(b).where(c)"': {
                input: [
                    { bool: 'or', field: 'a', operator: '=', value: 1 },
                    { bool: 'and', field: 'b', operator: '=', value: 2 },
                    { bool: 'and', field: 'c', operator: '=', value: 3 }
                ],
                expected: {
                    a: 1,
                    b: 2,
                    c: 3
                }
            },
            'case "query.where(a).where(b).orWhere(c)"': {
                input: [
                    { bool: 'and', field: 'a', operator: '=', value: 1 },
                    { bool: 'and', field: 'b', operator: '<', value: 2 },
                    { bool: 'or', field: 'c', operator: '>', value: 3 }
                ],
                expected: {
                    a: 1,
                    $or: [{ b: { $lt: 2 } }, { c: { $gt: 3 } }]
                }
            },
            'case "query.where(a).where(b).orWhere(c).where(d)"': {
                input: [
                    { bool: 'and', field: 'a', operator: '=', value: 1 },
                    { bool: 'and', field: 'b', operator: '=', value: 2 },
                    { bool: 'or', field: 'c', operator: '=', value: 3 },
                    { bool: 'and', field: 'd', operator: '=', value: 4 }
                ],
                expected: {
                    $and: [
                        {
                            a: 1,
                            d: 4
                        }
                    ],
                    $or: [{ b: 2 }, { c: 3 }]
                }
            }
        };
        const converter = new MongodbConditionConverter_1.MongodbConditionConverter([]);
        for (const name in dataset) {
            it(name, function () {
                expect(converter['convertConditions'](dataset[name].input)).toEqual(dataset[name].expected);
            });
        }
    });
    describe('.convert()', function () {
        it('converts QueryCondition data structure to mongodb query', function () {
            const converter = new MongodbConditionConverter_1.MongodbConditionConverter([
                { bool: 'and', field: 'a', operator: '=', value: 1 },
                { bool: 'and', field: 'b', operator: '=', value: 2 },
                { bool: 'or', field: 'c', operator: '=', value: 3 },
                { bool: 'and', field: 'd', operator: '=', value: 4 }
            ]);
            expect(converter.convert()).toEqual({
                $and: [
                    {
                        a: 1,
                        d: 4
                    }
                ],
                $or: [{ b: 2 }, { c: 3 }]
            });
        });
    });
});
