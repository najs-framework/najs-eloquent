import '../../factory/FactoryManager'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { NajsEloquent } from '../../constants'
import { IFactory } from '../../factory/interfaces/IFactory'
import { IFactoryManager, ModelClass } from '../../factory/interfaces/IFactoryManager'
import { ChanceFaker } from '../../factory/FactoryManager'

const facade = Facade.create<IFactoryManager<ChanceFaker>>(container, 'FactoryManager', function() {
  return make<IFactoryManager<ChanceFaker>>(NajsEloquent.Factory.FactoryManager)
})

export const FactoryFacade: IFactoryManager<ChanceFaker> & IFacade = facade
export const Factory: IFactoryManager<ChanceFaker> & IFacadeBase = facade
export const factory: IFactory = <any>function(className: string | ModelClass<any>, arg1: any, arg2: any): any {
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
  return typeof amount === 'undefined' ? Factory.of(className, name) : Factory.of(className, name).times(<number>amount)
}
