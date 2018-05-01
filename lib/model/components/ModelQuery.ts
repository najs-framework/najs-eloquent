/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { register } from 'najs-binding'
import { NajsEloquent, StartQueryFunctions } from '../../constants'

export class ModelQuery implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelQuery
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelQuery
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['newQuery'] = ModelQuery.newQuery
    for (const name of StartQueryFunctions) {
      prototype[name] = ModelQuery.forwardToQueryBuilder(name)
    }
  }

  static get ForwardToQueryBuilderMethods() {
    return StartQueryFunctions
  }

  static newQuery(this: NajsEloquent.Model.IModel<any>): any {
    return this['driver'].newQuery()
  }

  static forwardToQueryBuilder(name: string): any {
    return function(this: NajsEloquent.Model.IModel<any>): any {
      return this['driver'].newQuery()[name](...arguments)
    }
  }
}
register(ModelQuery)
