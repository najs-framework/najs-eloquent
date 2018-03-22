import '../../providers/DriverManager'
import { make } from 'najs-binding'
import { Facade, IFacade } from 'najs-facade'
import { NajsEloquent } from '../NajsEloquent'
import { NajsEloquentClass } from '../../constants'
import { IEloquentDriverProvider } from '../../providers/interfaces/IEloquentDriverProvider'

const facade = Facade.create<IEloquentDriverProvider>(NajsEloquent, 'DriverManager', function() {
  return make<IEloquentDriverProvider>(NajsEloquentClass.DriverManager)
})

export const EloquentDriverProviderFacade: IEloquentDriverProvider & IFacade = facade
export const EloquentDriverProvider: IEloquentDriverProvider = facade
