import { Eloquent } from '../model/Eloquent'
import { IEloquentDriver } from './interfaces/IEloquentDriver'
import { IBasicQuery } from '../query-builders/interfaces/IBasicQuery'
import { IConditionQuery } from '../query-builders/interfaces/IConditionQuery'

export class DummyDriver<T extends Object = {}> implements IEloquentDriver<T> {
  model: Eloquent<T>

  initialize(model: Eloquent<T>, data: T): void {
    this.model = model
    this.model['attributes'] = data || {}
  }

  getAttribute(name: string): any {
    return this.model['attributes'][name]
  }

  setAttribute(name: string, value: any): boolean {
    this.model['attributes'][name] = value
    return true
  }

  getId(): any {
    return this.getAttribute('id')
  }

  setId(id: any): void {
    this.setAttribute('id', id)
  }

  newQuery(): IBasicQuery & IConditionQuery {
    return <any>{}
  }

  toObject(): Object {
    return this.model['attribute']
  }

  toJSON(): Object {
    return this.model['attribute']
  }

  is(model: Eloquent): boolean {
    return model['attributes'] === this.model['attributes']
  }
}
