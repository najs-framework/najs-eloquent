declare namespace NajsEloquent.Model {
    class IModelFillable {
        /**
         * The attributes that are mass assignable.
         */
        protected fillable?: string[];
        /**
         * The attributes that aren't mass assignable.
         */
        protected guarded?: string[];
    }
    interface IModelFillable {
        /**
         * Get the fillable attributes for the model.
         */
        getFillable(): string[];
        /**
         * Get the guarded attributes for the model.
         */
        getGuarded(): string[];
        /**
         * Add temporary fillable attributes for current instance.
         *
         * @param {string|string[]} keys
         */
        markFillable(...keys: Array<string | string[]>): this;
        /**
         * Add temporary guarded attributes for current instance.
         *
         * @param {string|string[]} keys
         */
        markGuarded(...keys: Array<string | string[]>): this;
        /**
         * Determine if the given attribute may be mass assigned.
         *
         * @param {string} key
         */
        isFillable(...keys: Array<string | string[]>): boolean;
        /**
         * Determine if the given key is guarded.
         *
         * @param {string} key
         */
        isGuarded(...keys: Array<string | string[]>): boolean;
        /**
         * Fill the model with an array of attributes.
         *
         * @param {Object} data
         */
        fill(data: Object): this;
        /**
         * Fill the model with an array of attributes. Force mass assignment.
         *
         * @param {Object} data
         */
        forceFill(data: Object): this;
    }
}
