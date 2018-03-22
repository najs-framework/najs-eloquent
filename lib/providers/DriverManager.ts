import { Facade } from 'najs-facade'
import { NajsEloquentClass } from '../constants'
import { IEloquentDriverProvider } from './interfaces/IEloquentDriverProvider'
import { register, make, getClassName, IAutoload } from 'najs-binding'
import { Eloquent } from '../model/Eloquent'
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver'

export class DriverManager extends Facade implements IEloquentDriverProvider, IAutoload {
  static className: string = NajsEloquentClass.DriverManager

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
    return NajsEloquentClass.DriverManager
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

  protected createDriver<T>(model: Eloquent<T>, driverClass: string): IEloquentDriver<T> {
    return make<IEloquentDriver<T>>(driverClass, [model])
  }

  create<T extends Object = {}>(model: Eloquent<T>): IEloquentDriver<T> {
    return this.createDriver(model, this.findDriverClassName(model))
  }

  findDriverClassName(model: Eloquent<any> | string): string {
    const modelName = typeof model === 'string' ? model : model.getClassName()
    if (this.binding[modelName] === 'undefined' || typeof this.drivers[this.binding[modelName]] === 'undefined') {
      return this.findDefaultDriver()
    }
    return this.drivers[this.binding[modelName]].driverClassName
  }

  register(driver: any, name: string, isDefault: boolean = false): void {
    register(driver)
    this.drivers[name] = {
      driverClassName: getClassName(driver),
      isDefault: isDefault
    }
  }

  bind(model: string, driver: string) {
    this.binding[model] = driver
  }
}
register(DriverManager)
