/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { register } from 'najs-binding'
import { NajsEloquent } from '../../constants'
// import { flatten } from 'lodash'

// function find_relations_in_prototype(prototype: Object, relations: Object) {}

// export function findRelationsForModel(model: NajsEloquent.Model.IModel<any>) {
//   const relations = {}
//   find_relations_in_prototype(Object.getPrototypeOf(model), relations)
// }

export class ModelRelation implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelRelation
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelRelation
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['load'] = ModelRelation.load
    prototype['getRelationByName'] = ModelRelation.getRelationByName
    prototype['defineRelationProperty'] = ModelRelation.defineRelationProperty
  }

  static load: NajsEloquent.Model.ModelMethod<any> = async function() {
    console.warn('Relation feature is not available until v0.4.0')
    // const relations: string[] = flatten(arguments)
    // for (const relationName of relations) {
    //   this.getRelationByName(relationName).lazyLoad(this)
    // }
    // return this
  }

  static getRelationByName: NajsEloquent.Model.ModelMethod<any> = function(name: string) {
    console.warn('Relation feature is not available until v0.4.0')
    // const relationNames = name.split('.')
    // for (const relationName of relationNames) {
    //   return this[relationName]
    // }
    return ModelRelation.callMappedRelationByName(this, name)
  }

  static callMappedRelationByName(model: NajsEloquent.Model.IModel<any>, name: string) {
    if (typeof model['relations'] === 'undefined' || typeof model['relations'][name] === 'undefined') {
      throw new Error(`Relation "${name}" is not found in model "${model.getModelName()}".`)
    }
    const mapping = model['relations'][name]
    if (mapping.type === 'getter') {
      return model[mapping.mapTo]
    }
    return model[mapping.mapTo].call(model)
  }

  static defineRelationProperty: NajsEloquent.Model.ModelMethod<any> = async function(name: string) {
    console.warn('Relation feature is not available until v0.4.0')
    if (this['__sample']) {
      this['relationName'] = name
    }
    // TODO: always returns RelationFactory
  }
}
register(ModelRelation)
