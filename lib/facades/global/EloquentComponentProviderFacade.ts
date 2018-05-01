/// <reference path="../../contracts/ComponentProvider.ts" />

import '../../providers/ComponentProvider'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { NajsEloquent } from '../../constants'

const facade = Facade.create<Najs.Contracts.Eloquent.ComponentProvider>(container, 'ComponentProvider', function() {
  return make<Najs.Contracts.Eloquent.ComponentProvider>(NajsEloquent.Provider.ComponentProvider)
})

export const EloquentComponentProviderFacade: Najs.Contracts.Eloquent.ComponentProvider & IFacade = facade
export const EloquentComponentProvider: Najs.Contracts.Eloquent.ComponentProvider & IFacadeBase = facade
