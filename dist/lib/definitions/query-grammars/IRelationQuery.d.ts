declare namespace NajsEloquent.QueryGrammar {
    interface IRelationQuery {
        /**
         * Load given relations name when the query get executed.
         *
         * @param {string|string[]} relations
         */
        with(...relations: Array<string | string[]>): this;
    }
}
