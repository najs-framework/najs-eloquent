/// <reference path="../features/ITimestampsFeature.ts" />

namespace NajsEloquent.Model {
  export declare class IModelTimestamps {
    /**
     * Timestamps setting.
     */
    protected timestamps?: Feature.ITimestampsSetting | boolean
  }

  export interface IModelTimestamps {
    /**
     * Update the model's update timestamp.
     */
    touch(): this
  }
}
