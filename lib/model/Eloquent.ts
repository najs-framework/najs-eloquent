/// <reference path="interfaces/IModel.ts" />
/// <reference path="interfaces/IModelQuery.ts" />
/// <reference path="interfaces/static/IMongooseStatic.ts" />

import { make, register } from 'najs-binding'
import { Model } from './Model'
import { CREATE_SAMPLE } from '../util/ClassSetting'
import { DynamicAttribute } from './components/DynamicAttribute'
import { ModelQuery } from './components/ModelQuery'
import { StaticQuery } from './components/StaticQuery'
import { EloquentProxy } from './EloquentProxy'
import { EloquentComponentProvider } from '../facades/global/EloquentComponentProviderFacade'
import { MongooseQueryBuilderWrapper } from '../wrappers/MongooseQueryBuilderWrapper'

export interface EloquentStaticMongoose<T>
  extends NajsEloquent.Model.Static.IMongooseStatic<T, MongooseQueryBuilderWrapper<Model<T> & T>> {}

export interface Eloquent<T extends Object = {}>
  extends NajsEloquent.Model.IModelQuery<T, NajsEloquent.Wrapper.IQueryBuilderWrapper<Model<T> & T>> {}

export class Eloquent<T extends Object = {}> extends Model<T> {
  /**
   * Model constructor.
   *
   * @param {Object|undefined} data
   */
  constructor(data?: Object, isGuarded: boolean = true) {
    super(data, isGuarded)
    if (data !== CREATE_SAMPLE) {
      EloquentComponentProvider.extend(this, this.driver)
      if (this.driver.useEloquentProxy()) {
        return new Proxy(this, EloquentProxy)
      }
    }
  }

  /**
   * Register given model.
   *
   * @param {Eloquent} model
   */
  static register(model: { new (): Eloquent<any> | Model<any> | NajsEloquent.Model.IModel<any> }) {
    register(model)
    Reflect.construct(model, [])
  }

  static Mongoose<T>(): EloquentStaticMongoose<T> {
    return <any>Eloquent
  }

  static Class<T>(): EloquentStaticMongoose<T> {
    return <any>Eloquent
  }
}

const defaultComponents: Najs.Contracts.Eloquent.Component[] = [make(ModelQuery.className), make(StaticQuery.className)]
for (const component of defaultComponents) {
  component.extend(Eloquent.prototype, [], <any>{})
}

EloquentComponentProvider.register(DynamicAttribute, 'dynamic-attribute', true)
