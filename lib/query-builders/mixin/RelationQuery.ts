/// <reference path="../../definitions/query-grammars/IRelationQuery.ts" />
import QueryBuilder = NajsEloquent.QueryBuilder.QueryBuilderInternal

import { flatten } from 'lodash'

export const RelationQuery: NajsEloquent.QueryGrammar.IRelationQuery = {
  with(this: QueryBuilder, ...relations: Array<string | string[]>) {
    this.handler.setEagerRelations(flatten(relations))

    return this
  }
}
