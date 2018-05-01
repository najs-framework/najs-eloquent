declare namespace NajsEloquent.QueryBuilder {
    interface ISoftDeleteQuery {
        /**
         * Consider all soft-deleted or not-deleted items.
         */
        withTrashed(): this;
        /**
         * Consider soft-deleted items only.
         */
        onlyTrashed(): this;
    }
}
