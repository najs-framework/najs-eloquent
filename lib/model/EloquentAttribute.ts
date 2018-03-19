import { Eloquent } from './Eloquent'
import { isFunction, snakeCase } from 'lodash'

export class EloquentAttribute {
  protected known: string[]
  protected dynamic: {
    [key: string]: {
      name: string
      getter: boolean
      setter: boolean
      accessor?: string
      mutator?: string
    }
  }

  constructor(model: Eloquent, prototype: any) {
    this.dynamic = {}
    this.known = []
    this.findGettersAndSetters(prototype)
    this.findAccessorsAndMutators(prototype)
    this.buildKnownAttributes(model, prototype)
  }

  protected createDynamicAttributeIfNeeded(property: string) {
    if (!this.dynamic[property]) {
      this.dynamic[property] = {
        name: property,
        getter: false,
        setter: false
      }
    }
  }

  isKnownAttribute(name: string | Symbol) {
    if (typeof name === 'symbol') {
      return true
    }
    return this.known.indexOf(name as string) !== -1
  }

  buildKnownAttributes(model: Eloquent, prototype: any) {
    this.known = Array.from(
      new Set(
        model['getReservedNames']().concat(
          Object.getOwnPropertyNames(model),
          model['driver'].getDriverProxyMethods(),
          model['driver'].getQueryProxyMethods(),
          Object.getOwnPropertyNames(Eloquent.prototype),
          Object.getOwnPropertyNames(prototype)
        )
      )
    )
  }

  findGettersAndSetters(prototype: any) {
    const descriptors: Object = Object.getOwnPropertyDescriptors(prototype)
    for (const property in descriptors) {
      const getter = isFunction(descriptors[property].get)
      const setter = isFunction(descriptors[property].set)
      if (!getter && !setter) {
        continue
      }

      this.createDynamicAttributeIfNeeded(property)
      this.dynamic[property].getter = getter
      this.dynamic[property].setter = setter
    }
  }

  findAccessorsAndMutators(prototype: any) {
    const names = Object.getOwnPropertyNames(prototype)
    const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g')
    names.forEach(name => {
      let match
      while ((match = regex.exec(name)) != undefined) {
        // javascript RegExp has a bug when the match has length 0
        // if (match.index === regex.lastIndex) {
        //   ++regex.lastIndex
        // }
        const property: string = snakeCase(match[2])
        this.createDynamicAttributeIfNeeded(property)
        if (match[1] === 'get') {
          this.dynamic[property].accessor = match[0]
        } else {
          this.dynamic[property].mutator = match[0]
        }
      }
    })
  }

  getAttribute(target: Eloquent<any>, attribute: string) {
    if (!this.dynamic[attribute]) {
      return target.getAttribute(attribute)
    }

    if (this.dynamic[attribute].getter) {
      return target[attribute]
    }

    if (!this.dynamic[attribute].getter && this.dynamic[attribute].accessor) {
      return target[<string>this.dynamic[attribute].accessor].call(target)
    }

    return target.getAttribute(attribute)
  }

  setAttribute(target: Eloquent<any>, attribute: string, value: any) {
    if (!this.dynamic[attribute]) {
      return target.setAttribute(attribute, value)
    }

    if (this.dynamic[attribute].setter) {
      target[attribute] = value
      return true
    }

    if (!this.dynamic[attribute].setter && this.dynamic[attribute].mutator) {
      target[<string>this.dynamic[attribute].mutator].call(target, value)
      return true
    }

    return target.setAttribute(attribute, value)
  }
}
