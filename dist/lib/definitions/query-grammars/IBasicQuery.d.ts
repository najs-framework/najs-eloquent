declare namespace NajsEloquent.QueryGrammar {
    interface IBasicQuery {
        /**
         * Set the columns or fields to be selected.
         *
         * @param {string|string[]} fields
         */
        select(...fields: Array<string | string[]>): this;
        /**
         * Set the "limit" value of the query.
         * @param {number} records
         */
        limit(record: number): this;
        /**
         * Add an "order by" clause to the query.
         *
         * @param {string} field
         */
        orderBy(field: string): this;
        /**
         * Add an "order by" clause to the query.
         *
         * @param {string} field
         * @param {string} direction
         */
        orderBy(field: string, direction: 'asc' | 'desc'): this;
    }
}
