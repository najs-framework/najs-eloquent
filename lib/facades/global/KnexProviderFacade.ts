/// <reference path="../../contracts/KnexProvider.ts" />

import '../../providers/KnexProvider'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import * as Knex from 'knex'
import { NajsEloquent } from '../../constants'

export interface IKnexProviderFacade
  extends Najs.Contracts.Eloquent.KnexProvider<Knex, Knex.QueryBuilder, Knex.Config> {}

const facade = Facade.create<IKnexProviderFacade>(container, 'KnexProvider', function() {
  return make<IKnexProviderFacade>(NajsEloquent.Provider.KnexProvider)
})

export const KnexProviderFacade: IKnexProviderFacade & IFacade = facade
export const KnexProvider: IKnexProviderFacade & IFacadeBase = facade
