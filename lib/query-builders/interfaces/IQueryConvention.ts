/// <reference path="../../collect.js/index.d.ts" />

namespace NajsEloquent.QueryBuilder {
  export interface IQueryConvention {
    /**
     * Format the given name
     *
     * @param {string} name
     */
    formatFieldName(name: string): string

    /**
     * Get null value for given name
     *
     * @param {string} name
     */
    getNullValueFor(name: string): any
  }
}
