import { make } from 'najs-binding'
import { Facade, IFacade } from 'najs-facade'
import { NajsEloquent } from '../NajsEloquent'
import { NajsEloquentClass } from '../../constants'
import { IQueryLog } from '../../log/interfaces/IQueryLog'

const facade = Facade.create<IQueryLog>(NajsEloquent, 'QueryLog', function() {
  return make<IQueryLog>(NajsEloquentClass.QueryLog)
})

export const QueryLogFacade: IQueryLog & IFacade = facade
export const QueryLog: IQueryLog = facade
