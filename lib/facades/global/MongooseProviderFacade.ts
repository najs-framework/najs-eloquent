import '../../providers/BuiltinMongooseProvider'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { NajsEloquentClass } from '../../constants'
import { IMongooseProvider } from '../../providers/interfaces/IMongooseProvider'

const facade = Facade.create<IMongooseProvider>(container, 'MongooseProvider', function() {
  return make<IMongooseProvider>(NajsEloquentClass.MongooseProvider)
})

export const MongooseProviderFacade: IMongooseProvider & IFacade = facade
export const MongooseProvider: IMongooseProvider & IFacadeBase = facade
