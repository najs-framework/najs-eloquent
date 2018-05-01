declare namespace NajsEloquent.Model {
    interface ITimestampsSetting {
        createdAt: string;
        updatedAt: string;
    }
    class IModelTimestamps {
        /**
         * Timestamps setting.
         */
        protected timestamps?: ITimestampsSetting | boolean;
    }
    interface IModelTimestamps {
        /**
         * Determine the model is using timestamps or not.
         */
        hasTimestamps(): boolean;
        /**
         * Get timestamps setting.
         *
         * Note: It's returns default timestamps even the model is not using timestamps.
         */
        getTimestampsSetting(): ITimestampsSetting;
        /**
         * Update the model's update timestamp.
         */
        touch(): this;
    }
}
