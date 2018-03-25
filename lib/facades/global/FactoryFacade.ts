import '../../factory/FactoryManager'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { NajsEloquent } from '../NajsEloquent'
import { NajsEloquentClass } from '../../constants'
import { IFactoryManager } from '../../factory/interfaces/IFactoryManager'
import { IFactoryBuilder } from '../../factory/interfaces/IFactoryBuilder'
import { IFactory } from '../../factory/interfaces/IFactory'
import { ChanceFaker } from '../../factory/FactoryManager'

const facade = Facade.create<IFactoryManager<ChanceFaker>>(NajsEloquent, 'FactoryManager', function() {
  return make<IFactoryManager<ChanceFaker>>(NajsEloquentClass.FactoryManager)
})

export const FactoryFacade: IFactoryManager<ChanceFaker> & IFacade = facade
export const Factory: IFactoryManager<ChanceFaker> & IFacadeBase = facade
export const factory: IFactory = function(className: string, name: string = 'default'): IFactoryBuilder {
  return Factory.of(className, name)
}
