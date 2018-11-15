/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/relations/IRelationship.ts" />
/// <reference path="../definitions/features/ISerializationFeature.ts" />

import Model = NajsEloquent.Model.IModel
import Options = NajsEloquent.Feature.ToObjectOptions

import { flatten } from 'lodash'
import { register } from 'najs-binding'
import { FeatureBase } from './FeatureBase'
import { SerializationPublicApi } from './mixin/SerializationPublicApi'
import { NajsEloquent as NajsEloquentClasses } from '../constants'
import { isModel, isCollection } from '../util/helpers'
import { array_unique, override_setting_property_of_model } from '../util/functions'

const DEFAULT_TO_OBJECT_OPTIONS: Options = {
  relations: true,
  formatRelationName: true,
  applyVisibleAndHidden: true
}

export class SerializationFeature extends FeatureBase implements NajsEloquent.Feature.ISerializationFeature {
  getPublicApi(): object {
    return SerializationPublicApi
  }

  getFeatureName(): string {
    return 'Serialization'
  }

  getClassName(): string {
    return NajsEloquentClasses.Feature.SerializationFeature
  }

  getVisible(model: Model): string[] {
    const iModel = this.useInternalOf(model)
    if (typeof iModel.internalData.overridden !== 'undefined' && iModel.internalData.overridden.visible) {
      return model['visible']!
    }
    return this.useSettingFeatureOf(model).getArrayUniqueSetting(model, 'visible', [])
  }

  setVisible(model: NajsEloquent.Model.IModel, visible: string[]): void {
    override_setting_property_of_model(model, 'visible', visible)
  }

  addVisible(model: Model, keys: ArrayLike<string | string[]>): void {
    return this.useSettingFeatureOf(model).pushToUniqueArraySetting(model, 'visible', keys)
  }

  makeVisible(model: Model, keys: ArrayLike<string | string[]>): void {
    const hidden = this.getHidden(model)
    if (hidden.length > 0) {
      const names: string[] = array_unique(flatten(keys))
      this.setHidden(
        model,
        hidden.filter(function(item) {
          return names.indexOf(item) === -1
        })
      )
    }

    const visible = this.getVisible(model)
    if (visible.length !== 0) {
      this.addVisible(model, keys)
      return
    }
  }

  isVisible(model: Model, keys: ArrayLike<string | string[]>): boolean {
    return this.useSettingFeatureOf(model).isInWhiteList(model, keys, this.getVisible(model), this.getHidden(model))
  }

  getHidden(model: Model): string[] {
    const iModel = this.useInternalOf(model)
    if (typeof iModel.internalData.overridden !== 'undefined' && iModel.internalData.overridden.hidden) {
      return model['hidden']!
    }
    return this.useSettingFeatureOf(model).getArrayUniqueSetting(model, 'hidden', [])
  }

  setHidden(model: NajsEloquent.Model.IModel, hidden: string[]): void {
    override_setting_property_of_model(model, 'hidden', hidden)
  }

  addHidden(model: Model, keys: ArrayLike<string | string[]>): void {
    return this.useSettingFeatureOf(model).pushToUniqueArraySetting(model, 'hidden', keys)
  }

  makeHidden(model: Model, keys: ArrayLike<string | string[]>): void {
    const visible = this.getVisible(model)
    if (visible.length > 0) {
      const names: string[] = array_unique(flatten(keys as any))
      this.setVisible(
        model,
        visible.filter(function(item) {
          return names.indexOf(item) === -1
        })
      )
    }

    this.addHidden(model, keys)
  }

  isHidden(model: Model, keys: ArrayLike<string | string[]>): boolean {
    return this.useSettingFeatureOf(model).isInBlackList(model, keys, this.getHidden(model))
  }

  attributesToObject(model: Model, shouldApplyVisibleAndHidden: boolean = true): object {
    const data = this.useRecordManagerOf(model).toObject(model)
    return shouldApplyVisibleAndHidden ? this.applyVisibleAndHiddenFor(model, data) : data
  }

  relationDataToObject(model: Model, data: any, chains: string[], relationName: string, formatName: boolean) {
    if (isModel(data)) {
      return this.useSerializationFeatureOf(data as Model).toObject(data as Model, {
        relations: chains,
        formatRelationName: formatName
      })
    }

    if (isCollection(data)) {
      return data
        .map((nextModel: Model) => {
          return this.useSerializationFeatureOf(nextModel).toObject(nextModel, {
            relations: chains,
            formatRelationName: formatName
          })
        })
        .all()
    }

    return this.useRelationFeatureOf(model).getEmptyValueForSerializedRelation(model, relationName)
  }

  relationsToObject(
    model: Model,
    names: string[] | undefined,
    formatName: boolean,
    shouldApplyVisibleAndHidden: boolean = true
  ): object {
    const relations = typeof names === 'undefined' ? model.getLoadedRelations() : model.getRelations(names)
    const data = relations.reduce((memo, relation) => {
      const relationName = relation.getName()
      const name = formatName ? model.formatAttributeName(relationName) : relationName
      memo[name] = this.relationDataToObject(model, relation.getData(), relation.getChains(), relationName, formatName)
      return memo
    }, {})

    return shouldApplyVisibleAndHidden ? this.applyVisibleAndHiddenFor(model, data) : data
  }

  applyVisibleAndHiddenFor(model: Model, data: object) {
    const visible = this.getVisible(model),
      hidden = this.getHidden(model)

    const settingFeature = this.useSettingFeatureOf(model)
    return Object.getOwnPropertyNames(data).reduce((memo, name) => {
      if (settingFeature.isKeyInWhiteList(model, name, visible, hidden)) {
        memo[name] = data[name]
      }
      return memo
    }, {})
  }

  toObject(model: Model, options?: Options): object {
    const opts = Object.assign({}, DEFAULT_TO_OBJECT_OPTIONS, options)

    let relationData: object = {}
    if (opts.relations === true || typeof opts.relations === 'undefined') {
      relationData = this.relationsToObject(model, undefined, !!opts.formatRelationName, false)
    }
    if (Array.isArray(opts.relations)) {
      relationData = this.relationsToObject(model, opts.relations, !!opts.formatRelationName, false)
    }

    const data = Object.assign({}, this.attributesToObject(model, false), relationData)

    if (typeof opts.hidden !== 'undefined' && opts.hidden.length > 0) {
      this.makeHidden(model, opts.hidden)
    }
    if (typeof opts.visible !== 'undefined' && opts.visible.length > 0) {
      this.makeVisible(model, opts.visible)
    }
    return opts.applyVisibleAndHidden ? this.applyVisibleAndHiddenFor(model, data) : data
  }

  toJson(model: Model, replacer?: (key: string, value: any) => any, space?: string | number): string {
    return JSON.stringify(model, replacer, space)
  }
}
register(SerializationFeature, 'NajsEloquent.Feature.SerializationFeature')
