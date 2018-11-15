/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/ITimestampsFeature.ts" />

import { register } from 'najs-binding'
import { FeatureBase } from './FeatureBase'
import { TimestampsPublicApi } from './mixin/TimestampsPublicApi'
import { NajsEloquent } from '../constants'

export class TimestampsFeature extends FeatureBase implements NajsEloquent.Feature.ITimestampsFeature {
  static DefaultSetting: NajsEloquent.Feature.ITimestampsSetting = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }

  getPublicApi(): object {
    return TimestampsPublicApi
  }

  getFeatureName(): string {
    return 'Timestamps'
  }

  getClassName(): string {
    return NajsEloquent.Feature.TimestampsFeature
  }

  hasTimestamps(model: NajsEloquent.Model.IModel): boolean {
    return this.useSettingFeatureOf(model).hasSetting(model, 'timestamps')
  }

  getTimestampsSetting(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ITimestampsSetting {
    return this.useSettingFeatureOf(model).getSettingWithDefaultForTrueValue(
      model,
      'timestamps',
      TimestampsFeature.DefaultSetting
    )
  }

  touch(model: NajsEloquent.Model.IModel): void {
    if (this.hasTimestamps(model)) {
      model.markModified(this.getTimestampsSetting(model).updatedAt)
    }
  }
}
register(TimestampsFeature, NajsEloquent.Feature.TimestampsFeature)
