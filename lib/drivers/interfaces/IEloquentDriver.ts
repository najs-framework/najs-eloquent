import { Eloquent } from '../../model/Eloquent'
import { IBasicQuery } from '../../query-builders/interfaces/IBasicQuery'
import { IConditionQuery } from '../../query-builders/interfaces/IConditionQuery'

export interface IEloquentDriver {
  initialize(model: Eloquent): void

  getId(): any

  setId(id: any): void

  getAttribute(name: string): any

  setAttribute(name: string, value: any): boolean

  newQuery(): IBasicQuery & IConditionQuery

  toObject(fields: string[]): Object

  toJson(fields: string[]): Object

  is(model: Eloquent): boolean
}
