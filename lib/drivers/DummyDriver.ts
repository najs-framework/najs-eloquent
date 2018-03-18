import { Eloquent } from '../model/Eloquent'
import { IEloquentDriver } from './interfaces/IEloquentDriver'
import { IBasicQuery } from '../query-builders/interfaces/IBasicQuery'
import { IConditionQuery } from '../query-builders/interfaces/IConditionQuery'

export class DummyDriver<T extends Object = {}> implements IEloquentDriver<T> {
  static className: string = 'NajsEloquent.DummyDriver'

  attributes: Object = {}
  model: Eloquent<T>

  initialize(data?: T): void {
    this.attributes = data || {}
  }

  getAttribute(name: string): any {
    return this.attributes[name]
  }

  setAttribute(name: string, value: any): boolean {
    this.attributes[name] = value
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
    return this.attributes
  }

  toJSON(): Object {
    return this.attributes
  }

  is(model: Eloquent<T>): boolean {
    return this.attributes['id'] === model['driver']['attributes']['id']
  }

  getReservedProperties(): string[] {
    return ['dummy']
  }
}
