namespace NajsEloquent.Model {
  export declare class IModelSerialization {
    /**
     * The attributes that are visible when serialized.
     */
    protected visible?: string[]

    /**
     * The attributes that are hidden when serialized.
     */
    protected hidden?: string[]
  }

  export interface IModelSerialization {
    /**
     * Get the visible attributes for the model.
     */
    getVisible(): string[]

    /**
     * Set the visible attributes for the model. Warning: this function reset all visible setting included static.
     */
    setVisible(visible: string[]): this

    /**
     * Add temporary visible attributes for the model.
     *
     * @param {string|string[]} keys
     */
    addVisible(...keys: Array<string | string[]>): this

    /**
     * Make the given, typically hidden, attributes visible.
     *
     * @param {Model} model
     * @param {Array<string|string[]>} keys
     */
    makeVisible(...keys: Array<string | string[]>): this

    /**
     * Determine if the given attribute may be included in JSON.
     *
     * @param {string} key
     */
    isVisible(...keys: Array<string | string[]>): boolean

    /**
     * Get the hidden attributes for the model.
     */
    getHidden(): string[]

    /**
     * Set the hidden attributes for the model. Warning: this function reset all hidden setting included static.
     */
    setHidden(hidden: string[]): this

    /**
     * Add temporary hidden attributes for the model.
     *
     * @param {string|string[]} keys
     */
    addHidden(...keys: Array<string | string[]>): this

    /**
     * Make the given, typically visible, attributes hidden.
     *
     * @param {Model} model
     * @param {Array<string|string[]>} keys
     */
    makeHidden(...keys: Array<string | string[]>): this

    /**
     * Determine if the given key hidden in JSON.
     *
     * @param {string} key
     */
    isHidden(...keys: Array<string | string[]>): boolean

    /**
     * Convert the model data to a plain object.
     *
     * Visible and hidden are applied.
     */
    attributesToObject<T extends object = object>(): T

    /**
     * Convert the loaded relations to a plain object the name of relation in result is formatted like an attribute.
     *
     * Visible and hidden are applied.
     */
    relationsToObject<T extends object = object>(): T
    /**
     * Convert the model given relations to a plain object the name of relation in result is formatted like an attribute.
     *
     * Visible and hidden are applied.
     */
    relationsToObject<T extends object = object>(...names: Array<string | string[]>): T
    /**
     * Convert the model given relations to a plain object with option format name like attribute or not.
     *
     * Visible and hidden are applied.
     */
    relationsToObject<T extends object = object>(formatName: boolean, ...names: Array<string | string[]>): T

    /**
     * Convert the model data and model relations to a plain object.
     *
     * Visible and hidden are applied.
     */
    toObject<T extends object = object>(): T
    /**
     * Convert the model data and model given relations to a plain object with custom options.
     */
    toObject<T extends object = object>(options: Feature.ToObjectOptions): T

    /**
     * Convert model data and relations to a plain object which used for JSON.stringify()
     */
    toJSON<T extends object = object>(): T
    /**
     * Convert the model data and model given relations to a plain object with custom options.
     */
    toJSON<T extends object = object>(options: Feature.ToObjectOptions): T

    /**
     * Convert the model instance to JSON string.
     */
    toJson(replacer?: (key: string, value: any) => any, space?: string | number): string
  }
}
