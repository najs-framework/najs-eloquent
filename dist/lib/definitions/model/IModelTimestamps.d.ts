/// <reference path="../features/ITimestampsFeature.d.ts" />
declare namespace NajsEloquent.Model {
    class IModelTimestamps {
        /**
         * Timestamps setting.
         */
        protected timestamps?: Feature.ITimestampsSetting | boolean;
    }
    interface IModelTimestamps {
        /**
         * Update the model's update timestamp.
         */
        touch(): this;
    }
}
