/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/ISoftDeletesFeature.ts" />

import { ModelEvent } from '../model/ModelEvent'
import { register } from 'najs-binding'
import { FeatureBase } from './FeatureBase'
import { SoftDeletesPublicApi } from './mixin/SoftDeletesPublicApi'
import { NajsEloquent } from '../constants'

export class SoftDeletesFeature extends FeatureBase implements NajsEloquent.Feature.ISoftDeletesFeature {
  static DefaultSetting: NajsEloquent.Feature.ISoftDeletesSetting = {
    deletedAt: 'deleted_at',
    overrideMethods: false
  }

  getPublicApi(): object {
    return SoftDeletesPublicApi
  }

  getFeatureName(): string {
    return 'SoftDeletes'
  }

  getClassName(): string {
    return NajsEloquent.Feature.SoftDeletesFeature
  }

  hasSoftDeletes(model: NajsEloquent.Model.IModel): boolean {
    return this.useSettingFeatureOf(model).hasSetting(model, 'softDeletes')
  }

  getSoftDeletesSetting(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ISoftDeletesSetting {
    return this.useSettingFeatureOf(model).getSettingWithDefaultForTrueValue(
      model,
      'softDeletes',
      SoftDeletesFeature.DefaultSetting
    )
  }

  trashed(model: NajsEloquent.Model.IModel): boolean {
    if (!this.hasSoftDeletes(model)) {
      return false
    }

    return model.getAttribute(this.getSoftDeletesSetting(model).deletedAt) !== null
  }

  async forceDelete(model: NajsEloquent.Model.IModel): Promise<boolean> {
    await model.fire(ModelEvent.Deleting)
    const result = await this.useRecordManagerOf(model)
      .getRecordExecutor(model)
      .hardDelete()
    await model.fire(ModelEvent.Deleted)

    return result !== false
  }

  async restore(model: NajsEloquent.Model.IModel): Promise<boolean> {
    if (this.hasSoftDeletes(model) && !model.isNew()) {
      await model.fire(ModelEvent.Restoring)
      const result = await this.useRecordManagerOf(model)
        .getRecordExecutor(model)
        .restore()
      await model.fire(ModelEvent.Restored)

      return result !== false
    }

    return false
  }
}
register(SoftDeletesFeature, NajsEloquent.Feature.SoftDeletesFeature)
