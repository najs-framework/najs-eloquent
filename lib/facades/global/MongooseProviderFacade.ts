/// <reference path="../../contracts/DriverProvider.ts" />

import '../../providers/MongooseProvider'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { Mongoose, Model, Schema, Document } from 'mongoose'
import { NajsEloquent } from '../../constants'

export interface IMongooseProviderFacade
  extends Najs.Contracts.Eloquent.MongooseProvider<Mongoose, Schema, Model<Document>> {}

const facade = Facade.create<IMongooseProviderFacade>(container, 'MongooseProvider', function() {
  return make<IMongooseProviderFacade>(NajsEloquent.Provider.MongooseProvider)
})

export const MongooseProviderFacade: IMongooseProviderFacade & IFacade = facade
export const MongooseProvider: IMongooseProviderFacade & IFacadeBase = facade
