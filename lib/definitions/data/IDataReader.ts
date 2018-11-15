namespace NajsEloquent.Data {
  export interface IDataReader<T> {
    /**
     * Get an attribute of data.
     *
     * @param {T} data
     * @param {string} field
     */
    getAttribute<R>(data: T, field: string): R

    /**
     * Pick some fields in data.
     *
     * @param {object} data
     * @param {string[]} fields
     */
    pick(data: T, fields: string[]): T

    /**
     * Convert give value to comparable value if needed, typically convert value like ObjectID to string.
     *
     * @param {mixed} value
     */
    toComparable<R>(value: any): R
  }
}
