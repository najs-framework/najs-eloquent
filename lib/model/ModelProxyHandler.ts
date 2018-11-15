/// <reference path="../definitions/model/IModel.ts" />

import Model = NajsEloquent.Model.ModelInternal

export const ModelProxyHandler: ProxyHandler<Model> = {
  get(target: Model, key: string) {
    if (target.driver.shouldBeProxied(target, key)) {
      return target.driver.proxify('get', target, key)
    }
    return target[key]
  },

  set(target: Model, key: string, value: any): boolean {
    if (target.driver.shouldBeProxied(target, key)) {
      return target.driver.proxify('set', target, key, value)
    }
    target[key] = value
    return true
  }
}
