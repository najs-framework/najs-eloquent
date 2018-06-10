/// <reference path="../../contracts/MongodbProvider.ts" />

import '../../providers/MongodbProvider'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { MongoClient, Db } from 'mongodb'
import { NajsEloquent } from '../../constants'

export interface IMongodbProviderFacade extends Najs.Contracts.Eloquent.MongodbProvider<MongoClient, Db> {}

const facade = Facade.create<IMongodbProviderFacade>(container, 'MongodbProvider', function() {
  return make<IMongodbProviderFacade>(NajsEloquent.Provider.MongodbProvider)
})

export const MongodbProviderFacade: IMongodbProviderFacade & IFacade = facade
export const MongodbProvider: IMongodbProviderFacade & IFacadeBase = facade
