namespace NajsEloquent.Model {
  export interface IModelSharedMetadata {
    /**
     * The model's known attributes list.
     */
    knownAttributes: string[]

    /**
     * The model's dynamic attributes list.
     */
    dynamicAttributes: Feature.DynamicAttributeSetting[]
  }

  export interface IModelRecord<T = any> {
    /**
     * Get the record's name, i.e
     *  - With MySQL it is a table's name
     *  - With Mongoose it is a collection's name
     */
    getRecordName(): string

    /**
     * Get the native record instance.
     */
    getRecord(): T

    /**
     * Convert native record to an plain object, visible and hidden are not applied.
     */
    getAttributes(): object

    /**
     * Format given attribute name
     *
     * @param {string} name
     */
    formatAttributeName(name: string): string

    /**
     * Get value for given key.
     *
     * @param {Model} model
     * @param {string} key
     */
    getAttribute<K>(key: string): K

    /**
     * Set value for given key.
     *
     * @param {string} key
     * @param {mixed} value
     */
    setAttribute<T>(key: string, value: T): this

    /**
     * Determine give key is exists in Model or not.
     *
     * Note: if the given key is function name which exists in model it will returns true
     *
     * @param {string} key
     */
    hasAttribute(key: string): boolean

    /**
     * Get the primary key value.
     *
     * @param {Model} model
     */
    getPrimaryKey<K>(): K

    /**
     * Set the primary key by given value.
     *
     * @param {mixed} value
     */
    setPrimaryKey<K>(value: K): this

    /**
     * Get the primary key's name
     */
    getPrimaryKeyName(): string

    /**
     * Mark given attribute is modified.
     *
     * @param {string} name
     */
    markModified(...keys: Array<string | string[]>): this

    /**
     * Determine the attribute is modified or not.
     */
    isModified(...keys: Array<string | string[]>): boolean

    /**
     * Get modified fields name.
     */
    getModified(): string[]

    /**
     * Determine the model is new or not.
     */
    isNew(): boolean

    /**
     * Save model into database, create if not exists otherwise use update the model.
     */
    save(): Promise<this>

    /**
     * Create model into database, it may throws an exception if the model already exists. You can use .save() instead.
     */
    create(): Promise<this>

    /**
     * Update model into database, it may throws an exception if the model is not exists. You can use .save() instead.
     */
    update(): Promise<this>

    /**
     * Delete model use soft deletes if the soft delete settings is true otherwise will hard delete the model.
     */
    delete(): Promise<this>
  }
}
