/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { make } from 'najs-binding'
import { register } from 'najs-binding'
import { NajsEloquent, StartQueryFunctions } from '../../constants'

export class StaticQuery implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Driver.Component.StaticQuery
  getClassName(): string {
    return NajsEloquent.Driver.Component.StaticQuery
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    const constructor = prototype.constructor
    constructor['newQuery'] = StaticQuery.newQuery
    for (const name of StartQueryFunctions) {
      constructor[name] = StaticQuery.forwardToNewQuery(name)
    }
  }

  static newQuery(this: any): any {
    return make<any>(this).newQuery()
  }

  static get ForwardToNewQueryMethods() {
    return StartQueryFunctions
  }

  static forwardToNewQuery(name: string): any {
    return function(this: any): any {
      return this.newQuery()[name](...arguments)
    }
  }
}
register(StaticQuery)
