import '../../providers/BuiltinMongooseProvider'
import { make } from 'najs-binding'
import { Facade, IFacade } from 'najs-facade'
import { NajsEloquent } from '../NajsEloquent'
import { NajsEloquentClass } from '../../constants'
import { IMongooseProvider } from '../../providers/interfaces/IMongooseProvider'

const facade = Facade.create<IMongooseProvider>(NajsEloquent, 'MongooseProvider', function() {
  return make<IMongooseProvider>(NajsEloquentClass.MongooseProvider)
})

export const MongooseProviderFacade: IMongooseProvider & IFacade = facade
export const MongooseProvider: IMongooseProvider = facade
