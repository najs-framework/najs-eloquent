/// <reference path="../contracts/Driver.ts" />
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/IRecordManager.ts" />

import Model = NajsEloquent.Model.ModelInternal

import { isFunction } from 'lodash'
import { array_unique } from '../util/functions'
import { snakeCase } from 'lodash'
import { plural } from 'pluralize'
import { RecordManagerPublicApi } from '../features/mixin/RecordManagerPublicApi'

/**
 * Base class of all RecordManager, handling:
 *   - getKnownAttributes() and getDynamicAttributes() accessors
 *   - finding accessors/mutators and getters/setters of model
 */
export abstract class RecordManagerBase<T> implements NajsEloquent.Feature.IRecordManager<T> {
  abstract initialize(model: Model, isGuarded: boolean, data?: T | object): void

  abstract getAttribute(model: Model, key: string): any

  abstract setAttribute<T>(model: Model, key: string, value: T): boolean

  abstract hasAttribute(model: Model, key: string): boolean

  abstract getPrimaryKeyName(model: Model): string

  abstract toObject(model: Model): object

  abstract markModified(model: Model, keys: ArrayLike<Array<string | string[]>>): void

  abstract isModified(model: Model, keys: ArrayLike<Array<string | string[]>>): boolean

  abstract getModified(model: Model): string[]

  abstract isNew(model: Model): boolean

  abstract getClassName(): string

  protected executorFactory: NajsEloquent.Driver.IExecutorFactory

  constructor(executorFactory: NajsEloquent.Driver.IExecutorFactory) {
    this.executorFactory = executorFactory
  }

  getRecordExecutor(model: NajsEloquent.Model.ModelInternal<T>): NajsEloquent.Feature.IRecordExecutor {
    const executor = this.executorFactory.makeRecordExecutor(model, model.attributes)
    const executeMode = model.driver.getSettingFeature().getSettingProperty(model, 'executeMode', 'default')
    if (executeMode !== 'default') {
      executor.setExecuteMode(executeMode)
    }
    return executor
  }

  getFeatureName(): string {
    return 'RecordManager'
  }

  getRecordName(model: Model): string {
    return snakeCase(plural(model.getModelName()))
  }

  getRecord(model: Model<T>): T {
    return model.attributes
  }

  formatAttributeName(model: Model, name: string): string {
    return snakeCase(name)
  }

  getPrimaryKey(model: Model) {
    return this.getAttribute(model, this.getPrimaryKeyName(model))
  }

  setPrimaryKey<K>(model: Model, value: K): boolean {
    return this.setAttribute(model, this.getPrimaryKeyName(model), value)
  }

  getKnownAttributes(model: Model): string[] {
    return model['sharedMetadata']['knownAttributes']
  }

  getDynamicAttributes(model: Model): NajsEloquent.Feature.DynamicAttributeSetting[] {
    return model['sharedMetadata']['dynamicAttributes']
  }

  attachPublicApi(prototype: object, bases: object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    Object.assign(prototype, RecordManagerPublicApi)
    const knownAttributes = this.buildKnownAttributes(prototype, bases)
    const dynamicAttributes = this.buildDynamicAttributes(prototype, bases)

    Object.defineProperties(prototype['sharedMetadata'], {
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
    this.bindAccessorsAndMutators(prototype, dynamicAttributes)
  }

  buildKnownAttributes(prototype: object, bases: object[]) {
    return array_unique(
      ['__sample'],
      ['sharedMetadata', 'internalData', 'attributes', 'driver', 'primaryKey'],
      ['executeMode'],
      ['fillable', 'guarded'],
      ['visible', 'hidden'],
      ['schema', 'options'],
      ['timestamps'],
      ['softDeletes'],
      ['pivot'],
      Object.getOwnPropertyNames(prototype),
      ...bases.map(base => Object.getOwnPropertyNames(base))
    )
  }

  buildDynamicAttributes(prototype: object, bases: object[]) {
    const bucket = {}

    this.findGettersAndSetters(bucket, prototype)
    this.findAccessorsAndMutators(bucket, prototype)

    bases.forEach(basePrototype => {
      this.findGettersAndSetters(bucket, basePrototype)
      this.findAccessorsAndMutators(bucket, basePrototype)
    })

    return bucket
  }

  findGettersAndSetters(dynamicAttributes: object, prototype: object) {
    const descriptors: object = Object.getOwnPropertyDescriptors(prototype)
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

  findAccessorsAndMutators(bucket: object, prototype: any) {
    const names = Object.getOwnPropertyNames(prototype)
    const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g')
    names.forEach(name => {
      let match
      while ((match = regex.exec(name)) != undefined) {
        // javascript RegExp has a bug when the match has length 0
        // if (match.index === regex.lastIndex) {
        //   ++regex.lastIndex
        // }
        const property: string = this.formatAttributeName(prototype, match[2])
        this.createDynamicAttributeIfNeeded(bucket, property)
        if (match[1] === 'get') {
          bucket[property].accessor = match[0]
        } else {
          bucket[property].mutator = match[0]
        }
      }
    })
  }

  createDynamicAttributeIfNeeded(bucket: object, property: string) {
    if (!bucket[property]) {
      bucket[property] = {
        name: property,
        getter: false,
        setter: false
      }
    }
  }

  bindAccessorsAndMutators(prototype: object, dynamicAttributeSettings: object) {
    for (const name in dynamicAttributeSettings) {
      const descriptor: object | undefined = this.makeAccessorAndMutatorDescriptor(
        prototype,
        name,
        dynamicAttributeSettings[name]
      )
      if (descriptor) {
        Object.defineProperty(prototype, name, descriptor)
      }
    }
  }

  makeAccessorAndMutatorDescriptor(
    prototype: object,
    name: string,
    settings: NajsEloquent.Feature.DynamicAttributeSetting
  ): PropertyDescriptor | undefined {
    // does nothing if there is a setter and a getter in there
    if (settings.getter && settings.setter) {
      return undefined
    }

    const descriptor = Object.getOwnPropertyDescriptor(prototype, name) || { configurable: true }
    if (settings.accessor && !descriptor.get) {
      descriptor.get = function() {
        return this[this['sharedMetadata']['dynamicAttributes'][name].accessor].call(this)
      }
    }

    if (settings.mutator && !descriptor.set) {
      descriptor.set = function(value: any) {
        this[this['sharedMetadata']['dynamicAttributes'][name].mutator].call(this, value)
      }
    }

    return descriptor
  }
}
