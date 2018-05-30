declare namespace NajsEloquent.Model {
    interface IModelActiveRecord {
        /**
         * Determine the model is new model or not.
         *
         * Note: new model is the model which initialized but not saved in the database yet.
         */
        isNew(): boolean;
        /**
         * Determine the path is modified or not.
         *
         * @param {string|string[]} paths
         */
        isDirty(...paths: Array<string | string[]>): boolean;
        /**
         * Get modified paths.
         */
        getDirty(): string[];
        /**
         * Delete the model, use soft-delete if it is enabled.
         */
        delete(): Promise<boolean>;
        /**
         * Save the model, create if it is new, otherwise it will be updated.
         */
        save(): Promise<this>;
        /**
         * Get the fresh instance of current model.
         */
        fresh(): Promise<this | null>;
    }
}
