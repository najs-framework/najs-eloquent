/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { register } from 'najs-binding'
import { NajsEloquent } from '../../constants'
import { Relation } from './../../relations/Relation'
import { RelationFactory } from '../../relations/RelationFactory'
import { Eloquent } from '../Eloquent'
import { find_base_prototypes } from '../../util/functions'
// // import { flatten } from 'lodash'

function get_value_and_type_of_property(descriptor: PropertyDescriptor, instance: Object) {
  // perform getter or function for sample, the sample will contains "relationName"
  const sample = instance['getClassSetting']().getSample()

  if (typeof descriptor.value === 'function') {
    descriptor.value!.call(sample)
    return {
      value: descriptor.value!.call(instance),
      relationName: sample.relationName,
      type: 'function'
    }
  }

  if (typeof descriptor.get === 'function') {
    descriptor.get.call(sample)
    return {
      value: descriptor.get.call(instance),
      relationName: sample.relationName,
      type: 'getter'
    }
  }

  return undefined
}

function find_relation(name: string, descriptor: PropertyDescriptor, instance: Object, relationsMap: Object) {
  try {
    const result = get_value_and_type_of_property(descriptor, instance)
    if (result && result['value'] instanceof Relation) {
      relationsMap[result['relationName']] = {
        mapTo: name,
        type: result['type']
      }
    }
  } catch (error) {
    // console.error(error)
  }
}

function find_relations_in_prototype(instance: Object, prototype: Object, relationsMap: Object) {
  const descriptors = Object.getOwnPropertyDescriptors(prototype)
  for (const name in descriptors) {
    if (name === 'constructor' || name === 'hasAttribute') {
      continue
    }
    find_relation(name, descriptors[name], instance, relationsMap)
  }
}

export function findRelationsMapForModel(model: NajsEloquent.Model.IModel<any>) {
  const relationsMap = {}
  const modelPrototype = Object.getPrototypeOf(model)
  find_relations_in_prototype(model, modelPrototype, relationsMap)

  const basePrototypes = find_base_prototypes(modelPrototype, Eloquent.prototype)
  for (const prototype of basePrototypes) {
    if (prototype !== Eloquent.prototype) {
      find_relations_in_prototype(model, prototype, relationsMap)
    }
  }

  Object.defineProperty(modelPrototype, 'relationsMap', {
    value: relationsMap
  })
}

function define_relation_property_if_needed(model: NajsEloquent.Model.IModel<any>, name: string) {
  const prototype = Object.getPrototypeOf(model)
  const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, name)
  if (propertyDescriptor) {
    return
  }

  Object.defineProperty(prototype, name, {
    get: function(this: NajsEloquent.Model.IModel<any>) {
      if (typeof this['relationsMap'][name] === 'undefined') {
        throw new Error(`Relation "${name}" is not defined in model "${this.getModelName()}".`)
      }
      return this.getRelationByName(name).getData()
    }
  })
}

export class ModelRelation implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelRelation
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelRelation
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['load'] = ModelRelation.load
    prototype['getRelationByName'] = ModelRelation.getRelationByName
    prototype['defineRelationProperty'] = ModelRelation.defineRelationProperty
    prototype['getRelationDataBucket'] = ModelRelation.getRelationDataBucket
  }

  static getRelationDataBucket: NajsEloquent.Model.ModelMethod<any> = function() {
    return this['relationDataBucket']
  }

  static load: NajsEloquent.Model.ModelMethod<any> = async function() {
    ModelRelation.warningNotAvailableUntilVersion4()
    // const relations: string[] = flatten(arguments)
    // for (const relationName of relations) {
    //   this.getRelationByName(relationName).lazyLoad(this)
    // }
    // return this
  }

  static getRelationByName: NajsEloquent.Model.ModelMethod<any> = function(name: string) {
    ModelRelation.warningNotAvailableUntilVersion4()
    // const relationNames = name.split('.')
    // for (const relationName of relationNames) {
    //   return this[relationName]
    // }
    return ModelRelation.callMappedRelationByName(this, name)
  }

  static callMappedRelationByName(model: NajsEloquent.Model.IModel<any>, name: string) {
    if (typeof model['relationsMap'] === 'undefined' || typeof model['relationsMap'][name] === 'undefined') {
      throw new Error(`Relation "${name}" is not found in model "${model.getModelName()}".`)
    }
    const mapping = model['relationsMap'][name]
    if (mapping.type === 'getter') {
      return model[mapping.mapTo]
    }
    return model[mapping.mapTo].call(model)
  }

  static defineRelationProperty: NajsEloquent.Model.ModelMethod<any> = function(name: string) {
    ModelRelation.warningNotAvailableUntilVersion4()
    if (this['__sample']) {
      this['relationName'] = name
      return new RelationFactory(this, name, true)
    }

    if (typeof this['relations'][name] === 'undefined') {
      define_relation_property_if_needed(this, name)
      this['relations'][name] = {
        factory: new RelationFactory(this, name, false)
      }
    }
    return this['relations'][name].factory
  }

  static warningNotAvailableUntilVersion4() {
    // console.warn('Relation feature is not available until v0.4.0')
  }
}
register(ModelRelation)
