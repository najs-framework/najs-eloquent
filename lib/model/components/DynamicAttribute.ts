/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
/// <reference path="../interfaces/IModelDynamicAttribute.ts" />

import { NajsEloquent } from '../../constants'
import { array_unique } from '../../util/functions'
import { isFunction } from 'lodash'

export class DynamicAttribute implements Najs.Contracts.Eloquent.Component {
  getClassName(): string {
    return NajsEloquent.Model.Component.DynamicAttribute
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['hasAttribute'] = DynamicAttribute.hasAttribute
    const knownAttributes = DynamicAttribute.buildKnownAttributes(prototype, bases)
    const dynamicAttributes = DynamicAttribute.buildDynamicAttributes(prototype, bases, driver)

    Object.defineProperties(prototype, {
      knownAttributes: {
        value: knownAttributes,
        writable: false,
        configurable: true
      },
      dynamicAttributes: {
        value: dynamicAttributes,
        writable: false,
        configurable: true
      }
    })
    DynamicAttribute.bindAccessorsAndMutators(prototype, knownAttributes, dynamicAttributes)
  }

  static hasAttribute(this: NajsEloquent.Model.IModel<any>, key: string): boolean {
    return this['knownAttributes'].indexOf(key) !== -1 || this['driver'].hasAttribute(key)
  }

  static bindAccessorsAndMutators(prototype: Object, knownAttributes: string[], dynamicAttributes: Object) {
    for (const name in dynamicAttributes) {
      const descriptor: Object | undefined = this.buildAccessorAndMutatorDescriptor(
        prototype,
        name,
        dynamicAttributes[name]
      )
      if (descriptor) {
        Object.defineProperty(prototype, name, descriptor)
      }
    }
  }

  static buildAccessorAndMutatorDescriptor(
    prototype: Object,
    name: string,
    settings: NajsEloquent.Model.DynamicAttributeSettings
  ): Object | undefined {
    // does nothing if there is a setter and a getter in there
    if (settings.getter && settings.setter) {
      return undefined
    }

    const descriptor = Object.getOwnPropertyDescriptor(prototype, name) || { configurable: true }
    if (settings.accessor && !descriptor.get) {
      descriptor.get = function() {
        return this[this['dynamicAttributes'][name].accessor].call(this)
      }
    }

    if (settings.mutator && !descriptor.set) {
      descriptor.set = function(value: any) {
        this[this['dynamicAttributes'][name].mutator].call(this, value)
      }
    }
    return descriptor
  }

  static buildDynamicAttributes(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>) {
    const dynamicAttributes = {}
    this.findGettersAndSetters(dynamicAttributes, prototype)
    this.findAccessorsAndMutators(dynamicAttributes, prototype, driver)
    bases.forEach(basePrototype => {
      this.findGettersAndSetters(dynamicAttributes, basePrototype)
      this.findAccessorsAndMutators(dynamicAttributes, basePrototype, driver)
    })
    return dynamicAttributes
  }

  static findGettersAndSetters(dynamicAttributes: Object, prototype: Object) {
    const descriptors: Object = Object.getOwnPropertyDescriptors(prototype)
    for (const property in descriptors) {
      if (property === '__proto__') {
        continue
      }

      const getter = isFunction(descriptors[property].get)
      const setter = isFunction(descriptors[property].set)
      if (!getter && !setter) {
        continue
      }

      this.createDynamicAttributeIfNeeded(dynamicAttributes, property)
      dynamicAttributes[property].getter = getter
      dynamicAttributes[property].setter = setter
    }
  }

  static findAccessorsAndMutators(bucket: Object, prototype: any, driver: Najs.Contracts.Eloquent.Driver<any>) {
    const names = Object.getOwnPropertyNames(prototype)
    const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g')
    names.forEach(name => {
      let match
      while ((match = regex.exec(name)) != undefined) {
        // javascript RegExp has a bug when the match has length 0
        // if (match.index === regex.lastIndex) {
        //   ++regex.lastIndex
        // }
        const property: string = driver.formatAttributeName(match[2])
        this.createDynamicAttributeIfNeeded(bucket, property)
        if (match[1] === 'get') {
          bucket[property].accessor = match[0]
        } else {
          bucket[property].mutator = match[0]
        }
      }
    })
  }

  static createDynamicAttributeIfNeeded(bucket: Object, property: string) {
    if (!bucket[property]) {
      bucket[property] = {
        name: property,
        getter: false,
        setter: false
      }
    }
  }

  static buildKnownAttributes(prototype: Object, bases: Object[]) {
    return array_unique(
      ['knownAttributes', 'dynamicAttributes', 'attributes', 'settings', 'driver'],
      ['relationDataBucket'],
      ['fillable', 'guarded'],
      ['visible', 'hidden'],
      ['timestamps'],
      ['softDeletes'],
      Object.getOwnPropertyNames(prototype),
      ...bases.map(base => Object.getOwnPropertyNames(base))
    )
  }
}
