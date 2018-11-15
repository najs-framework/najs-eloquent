/// <reference path="../../contracts/MomentProvider.ts" />

import '../../providers/MomentProvider'
import { make } from 'najs-binding'
import { MomentProvider as MomentProviderClass } from '../../providers/MomentProvider'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Moment } from 'moment'
import { container } from '../container'
import { NajsEloquent } from '../../constants'

const facade = Facade.create<MomentProviderClass>(container, 'MomentProvider', function() {
  return make<MomentProviderClass>(NajsEloquent.Provider.MomentProvider)
})

export const MomentProviderFacade: Najs.Contracts.Eloquent.MomentProvider<Moment> & IFacade = facade
export const MomentProvider: Najs.Contracts.Eloquent.MomentProvider<Moment> & IFacadeBase = facade
