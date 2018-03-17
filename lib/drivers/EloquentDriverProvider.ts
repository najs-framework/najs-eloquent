import { register, make, getClassName } from 'najs-binding'
import { Eloquent } from '../model/Eloquent'
import { IEloquentDriver } from './interfaces/IEloquentDriver'

export class EloquentDriverProvider {
  protected static drivers: {
    [key: string]: {
      driverClassName: string
      isDefault: boolean
    }
  } = {}

  protected static binding: {
    [key: string]: string
  } = {}

  protected static findDefaultDriver(): string {
    return ''
  }

  protected static createDriver<T>(model: Eloquent<T>, driverClass: string): IEloquentDriver<T> {
    return make<IEloquentDriver<T>>(driverClass, [model])
  }

  static create<T extends Object = {}>(model: Eloquent<T>): IEloquentDriver<T> {
    return this.createDriver(model, this.findDriverClassName(model))
  }

  static findDriverClassName(model: string): string
  static findDriverClassName(model: Eloquent<any>): string
  static findDriverClassName(model: Eloquent<any> | string): string {
    const modelName = typeof model === 'string' ? model : model.getClassName()
    if (this.binding[modelName] === 'undefined' || typeof this.drivers[this.binding[modelName]] === 'undefined') {
      return this.findDefaultDriver()
    }
    return this.drivers[this.binding[modelName]].driverClassName
  }

  static register(driver: string, name: string, isDefault: boolean): void
  static register(driver: Function, name: string, isDefault: boolean): void
  static register(driver: any, name: string, isDefault: boolean): void {
    register(driver)
    this.drivers[name] = {
      driverClassName: getClassName(driver),
      isDefault: isDefault
    }
  }

  static bind(model: string, name: string) {
    this.binding[model] = name
  }
}
