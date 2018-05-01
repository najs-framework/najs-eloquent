/// <reference path="../contracts/DriverProvider.ts" />

import { Facade } from 'najs-facade'
import { register, make, getClassName } from 'najs-binding'
import { NajsEloquent } from '../constants'

export class DriverProvider extends Facade implements Najs.Contracts.Eloquent.DriverProvider {
  static className: string = NajsEloquent.Provider.DriverProvider

  protected drivers: {
    [key: string]: {
      driverClassName: string
      isDefault: boolean
    }
  } = {}

  protected binding: {
    [key: string]: string
  } = {}

  getClassName() {
    return NajsEloquent.Provider.DriverProvider
  }

  protected findDefaultDriver(): string {
    let first: string = ''
    for (const name in this.drivers) {
      if (!first) {
        first = this.drivers[name].driverClassName
      }
      if (this.drivers[name].isDefault) {
        return this.drivers[name].driverClassName
      }
    }
    return first
  }

  protected createDriver<T>(model: Object, driverClass: string, isGuarded: boolean): Najs.Contracts.Eloquent.Driver<T> {
    const driver = make<Najs.Contracts.Eloquent.Driver<T>>(driverClass, [model, isGuarded])
    // driver.createStaticMethods(<any>Object.getPrototypeOf(model).constructor)
    return driver
  }

  create<T extends Object = {}>(model: Object, isGuarded: boolean = true): Najs.Contracts.Eloquent.Driver<T> {
    return this.createDriver(model, this.findDriverClassName(model), isGuarded)
  }

  findDriverClassName(model: Object | string): string {
    const modelName = typeof model === 'string' ? model : getClassName(model)
    if (this.binding[modelName] === 'undefined' || typeof this.drivers[this.binding[modelName]] === 'undefined') {
      return this.findDefaultDriver()
    }
    return this.drivers[this.binding[modelName]].driverClassName
  }

  register(driver: string | Function, name: string, isDefault: boolean = false): this {
    if (typeof driver === 'function') {
      register(driver)
    }
    this.drivers[name] = {
      driverClassName: getClassName(driver),
      isDefault: isDefault
    }
    return this
  }

  bind(model: string, driver: string): this {
    this.binding[model] = driver
    return this
  }
}
register(DriverProvider)
