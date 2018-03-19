import { Eloquent } from './Eloquent'
import { isFunction, snakeCase } from 'lodash'
import { GET_FORWARD_TO_DRIVER_FUNCTIONS, GET_QUERY_FUNCTIONS } from './EloquentProxy'

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
        model['getReservedProperties']().concat(
          Object.getOwnPropertyNames(model),
          GET_FORWARD_TO_DRIVER_FUNCTIONS,
          GET_QUERY_FUNCTIONS,
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
}
