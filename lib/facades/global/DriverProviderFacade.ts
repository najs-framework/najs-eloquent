/// <reference path="../../contracts/DriverProvider.ts" />

import '../../providers/DriverProvider'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { NajsEloquent } from '../../constants'

const facade = Facade.create<Najs.Contracts.Eloquent.DriverProvider>(container, 'DriverProvider', function() {
  return make<Najs.Contracts.Eloquent.DriverProvider>(NajsEloquent.Provider.DriverProvider)
})

export const DriverProviderFacade: Najs.Contracts.Eloquent.DriverProvider & IFacade = facade
export const DriverProvider: Najs.Contracts.Eloquent.DriverProvider & IFacadeBase = facade
