/// <reference path="../contracts/ComponentProvider.ts" />

import { make, register, getClassName } from 'najs-binding'
import { Facade } from 'najs-facade'
import { NajsEloquent } from '../constants'
import { array_unique } from '../util/functions'

export class ComponentProvider extends Facade implements Najs.Contracts.Eloquent.ComponentProvider {
  static className: string = NajsEloquent.Provider.ComponentProvider

  protected components: {
    [key: string]: {
      className: string
      index: number
      isDefault: boolean
    }
  } = {}

  protected binding: {
    [key: string]: string[]
  } = {}

  protected extended: {
    [key: string]: string[]
  } = {}

  getClassName() {
    return NajsEloquent.Provider.ComponentProvider
  }

  extend(model: Object, driver: Najs.Contracts.Eloquent.Driver<any>): any {
    const prototype = Object.getPrototypeOf(model)
    const components = this.resolveComponents(model, driver)
    for (const component of components) {
      const className = getClassName(model)
      if (typeof this.extended[className] === 'undefined') {
        this.extended[className] = []
      }

      if (this.extended[className].indexOf(component.getClassName()) !== -1) {
        continue
      }
      this.extended[className].push(component.getClassName())
      component.extend(prototype, this.findBasePrototypes(prototype), driver)
    }
  }

  private findBasePrototypes(prototype: Object): Object[] {
    const bases: Object[] = []
    let count = 0
    do {
      prototype = Object.getPrototypeOf(prototype)
      bases.push(prototype)
      count++
    } while (count < 100 && (typeof prototype === 'undefined' || prototype !== Object.prototype))
    return bases
  }

  private resolveComponents(
    model: Object,
    driver: Najs.Contracts.Eloquent.Driver<any>
  ): Najs.Contracts.Eloquent.Component[] {
    const modelComponents = this.getComponents(getClassName(model))
    const driverComponents = driver.getModelComponentName()
    const combinedComponents = modelComponents.concat(driverComponents ? [driverComponents] : [])
    return driver.getModelComponentOrder(combinedComponents).map((name: string) => {
      return this.resolve(name)
    })
  }

  getComponents(model?: string): string[] {
    const defaultComponents = Object.keys(this.components).filter((name: string) => {
      return this.components[name].isDefault
    })
    const components: string[] = model ? defaultComponents.concat(this.binding[model] || []) : defaultComponents
    return components.sort((a: string, b: string) => {
      return this.components[a].index - this.components[b].index
    })
  }

  resolve(component: string): Najs.Contracts.Eloquent.Component {
    if (typeof this.components[component] === 'undefined') {
      throw new ReferenceError('Component "' + component + '" is not found.')
    }
    return make(this.components[component].className)
  }

  register(component: string | Function, name: string, isDefault: boolean = false): this {
    if (typeof component === 'function') {
      register(component)
    }
    const count = Object.keys(this.components).length
    this.components[name] = {
      className: getClassName(component),
      isDefault: isDefault,
      index: count
    }
    return this
  }

  bind(model: string, component: string): this {
    if (typeof this.binding[model] === 'undefined') {
      this.binding[model] = []
    }
    this.binding[model].push(component)
    this.binding[model] = array_unique(this.binding[model])
    return this
  }
}
register(ComponentProvider)
