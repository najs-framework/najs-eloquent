import '../../factory/FactoryManager'
import { make } from 'najs-binding'
import { Facade, IFacade } from 'najs-facade'
import { NajsEloquent } from '../NajsEloquent'
import { NajsEloquentClass } from '../../constants'
import { IFactoryManager } from '../../factory/interfaces/IFactoryManager'
import { ChanceFaker } from '../../factory/FactoryManager'

const facade = Facade.create<IFactoryManager<ChanceFaker>>(NajsEloquent, 'FactoryManager', function() {
  return make<IFactoryManager<ChanceFaker>>(NajsEloquentClass.FactoryManager)
})

export const FactoryFacade: IFactoryManager<ChanceFaker> & IFacade = facade
export const Factory: IFactoryManager<ChanceFaker> = facade
