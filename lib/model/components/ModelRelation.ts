/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { register } from 'najs-binding'
import { NajsEloquent } from '../../constants'
// import { flatten } from 'lodash'

export class ModelRelation implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelRelation
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelSerialization
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['load'] = ModelRelation.load
  }

  static load: NajsEloquent.Model.ModelMethod<any> = async function() {
    // const relations: string[] = flatten(arguments)
    // for (const relationName of relations) {
    //   this.getRelationByName(relationName).lazyLoad(this)
    // }
    // return this
  }

  static getRelationByName: NajsEloquent.Model.ModelMethod<any> = async function(name: string) {
    // const relationNames = name.split('.')
    // for (const relationName of relationNames) {
    //   return this[relationName]
    // }
  }
}
register(ModelRelation)
