import '../../providers/DriverManager'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { NajsEloquentClass } from '../../constants'
import { IEloquentDriverProvider } from '../../providers/interfaces/IEloquentDriverProvider'

const facade = Facade.create<IEloquentDriverProvider>(container, 'DriverManager', function() {
  return make<IEloquentDriverProvider>(NajsEloquentClass.DriverManager)
})

export const EloquentDriverProviderFacade: IEloquentDriverProvider & IFacade = facade
export const EloquentDriverProvider: IEloquentDriverProvider & IFacadeBase = facade
