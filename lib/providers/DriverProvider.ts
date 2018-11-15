/// <reference path="../contracts/DriverProvider.ts" />
import Driver = Najs.Contracts.Eloquent.Driver
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

  protected driverInstances: {
    [key: string]: any
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

  protected createDriver<T>(model: Object, driverClass: string, isGuarded: boolean): Driver<T> {
    if (typeof this.driverInstances[driverClass] === 'undefined') {
      this.driverInstances[driverClass] = make<Driver<T>>(driverClass, [model, isGuarded])
      // driver.createStaticMethods(<any>Object.getPrototypeOf(model).constructor)
    }
    return this.driverInstances[driverClass]
  }

  has(driver: Function): boolean {
    for (const name in this.drivers) {
      const item = this.drivers[name]
      if (item.driverClassName === getClassName(driver)) {
        return true
      }
    }
    return false
  }

  create<T extends Object = {}>(model: Object, isGuarded: boolean = true): Driver<T> {
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
register(DriverProvider, NajsEloquent.Provider.DriverProvider)
