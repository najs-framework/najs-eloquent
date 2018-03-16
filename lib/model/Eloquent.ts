import { IAutoload } from 'najs-binding'
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver'
import { EloquentProxy } from './EloquentProxy'

/**
 * Base class of an Eloquent, handles proxy attributes, contains cross-driver features like
 *   - fill
 *   - touch
 *   - member Querying
 *   - static Querying
 */
export abstract class Eloquent implements IAutoload {
  abstract getClassName(): string

  constructor(data: any) {
    if (data !== 'do-not-initialize') {
      return new Proxy(this, EloquentProxy)
    }
  }

  getDriver(): IEloquentDriver {
    return <any>{}
  }

  getAttribute(name: string): any {}
}
