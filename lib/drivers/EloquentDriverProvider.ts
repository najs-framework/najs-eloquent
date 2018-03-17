import { Eloquent } from '../model/Eloquent'
import { IEloquentDriver } from './interfaces/IEloquentDriver'

export class EloquentDriverProvider {
  create<T>(model: Eloquent<any>): IEloquentDriver<T> {
    return <any>{}
  }

  register(driver: IEloquentDriver, name: string) {}

  bind(model: string, name: IEloquentDriver) {}
}
