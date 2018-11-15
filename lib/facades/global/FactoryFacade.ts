/// <reference path="../../contracts/FactoryManager.ts" />

import '../../factory/FactoryManager'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { NajsEloquent } from '../../constants'

const facade = Facade.create<Najs.Contracts.Eloquent.FactoryManager>(container, 'FactoryManager', function() {
  return make<Najs.Contracts.Eloquent.FactoryManager>(NajsEloquent.Factory.FactoryManager)
})

export const FactoryFacade: Najs.Contracts.Eloquent.FactoryManager & IFacade = facade
export const Factory: Najs.Contracts.Eloquent.FactoryManager & IFacadeBase = facade
export const factory: Najs.Contracts.Eloquent.FactoryFunction = <any>(
  function(className: string | any, arg1: any, arg2: any): any {
    let name: string = 'default'
    if (typeof arg1 === 'string') {
      name = arg1
    }
    let amount: number | undefined = undefined
    if (typeof arg1 === 'number') {
      amount = arg1
    }
    if (typeof arg2 === 'number') {
      amount = arg2
    }
    return typeof amount === 'undefined'
      ? Factory.of(className, name)
      : Factory.of(className, name).times(<number>amount)
  }
)
