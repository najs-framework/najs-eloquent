namespace NajsEloquent.QueryGrammar {
  export interface IRelationQuery {
    /**
     * Load given relations name when the query get executed.
     *
     * @param {string|string[]} relations
     */
    with(...relations: Array<string | string[]>): this
  }
}
