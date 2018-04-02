import { make } from 'najs-binding'
import { RelationProxy } from './RelationProxy'
import { Eloquent } from '../model/Eloquent'

export class HasOneRelation<T> {
  protected loaded: boolean

  protected foreign?: Eloquent<any>
  protected foreignModel: string
  protected foreignKey: string

  protected localModel: string
  protected localKey: string
  protected local?: Eloquent<any>

  constructor(localModel: string, foreignModel: string, localKey: string, foreignKey: string) {
    this.loaded = false

    this.localModel = localModel
    this.foreignModel = foreignModel
    this.localKey = localKey
    this.foreignKey = foreignKey

    return new Proxy(this, RelationProxy)
  }

  setLocal(local: Eloquent<any>) {
    this.local = local
  }

  setForeign(foreign: Eloquent<any>) {
    this.foreign = foreign
  }

  isLoaded(): boolean {
    return this.loaded
  }

  load(): Promise<T> {
    if (!this.local && !this.foreign) {
      throw new Error('...')
    }

    // const isLocal = !!this.local
    // const model: Eloquent<any> = this.getModelByName(this.local ? this.foreignModel : this.localModel)
    // model['where'](isLocal ? this.foreignKey : this.localKey, this.local.getId());

    return <any>{}
  }

  getModelByName(name: string): Eloquent<any> {
    return make(name, [])
  }
}
