declare namespace NajsEloquent.QueryBuilder {
    interface IConvention {
        /**
         * Format the given name
         *
         * @param {string} name
         */
        formatFieldName(name: string): string;
        /**
         * Get null value for given name
         *
         * @param {string} name
         */
        getNullValueFor(name: string): any;
    }
}
