import '../../log/FlipFlopQueryLog'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { NajsEloquentClass } from '../../constants'
import { IQueryLog } from '../../log/interfaces/IQueryLog'

const facade = Facade.create<IQueryLog>(container, 'QueryLog', function() {
  return make<IQueryLog>(NajsEloquentClass.QueryLog)
})

export const QueryLogFacade: IQueryLog & IFacade = facade
export const QueryLog: IQueryLog & IFacadeBase = facade
