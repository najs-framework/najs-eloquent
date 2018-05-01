/// <reference path="../../contracts/QueryLog.ts" />

import '../../query-log/FlipFlopQueryLog'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { NajsEloquent } from '../../constants'

const facade = Facade.create<Najs.Contracts.Eloquent.QueryLog>(container, 'QueryLog', function() {
  return make<Najs.Contracts.Eloquent.QueryLog>(NajsEloquent.QueryLog.FlipFlopQueryLog)
})

export const QueryLogFacade: Najs.Contracts.Eloquent.QueryLog & IFacade = facade
export const QueryLog: Najs.Contracts.Eloquent.QueryLog & IFacadeBase = facade
