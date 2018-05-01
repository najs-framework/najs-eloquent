declare namespace NajsEloquent.Model {
    interface ISoftDeletesSetting {
        deletedAt: string;
        overrideMethods: boolean | 'all' | string;
    }
    class IModelSoftDeletes {
        /**
         * Soft deletes setting
         */
        protected softDeletes?: ISoftDeletesSetting | boolean;
    }
    interface IModelSoftDeletes {
        /**
         * Determine the model is using soft delete or not.
         */
        hasSoftDeletes(): boolean;
        /**
         * Get soft delete setting.
         *
         * Note: It's returns default soft delete even the model is not using soft delete.
         */
        getSoftDeletesSetting(): ISoftDeletesSetting;
        /**
         * Determine model is soft-deleted or not.
         */
        trashed(): boolean;
        /**
         * Delete the model even soft delete is enabled.
         */
        forceDelete(): Promise<boolean>;
        /**
         * Restore the model, only applied for model which has soft delete setting is enabled.
         */
        restore(): Promise<boolean>;
    }
}
