/// <reference path="./IFeature.ts" />
/// <reference path="../model/IModel.ts" />

namespace NajsEloquent.Feature {
  export interface ITimestampsSetting {
    createdAt: string
    updatedAt: string
  }

  export interface ITimestampsFeature extends IFeature {
    /**
     * Determine the model is using timestamps or not.
     */
    hasTimestamps(model: Model.IModel): boolean

    /**
     * Get timestamps setting.
     *
     * Note: It's returns default timestamps even the model is not using timestamps.
     */
    getTimestampsSetting(model: Model.IModel): ITimestampsSetting

    /**
     * Update the model's update timestamp.
     */
    touch(model: Model.IModel): void
  }
}
