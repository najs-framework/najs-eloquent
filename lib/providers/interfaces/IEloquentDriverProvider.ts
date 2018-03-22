import { Eloquent } from '../../model/Eloquent'
import { IEloquentDriver } from '../../drivers/interfaces/IEloquentDriver'

export interface IEloquentDriverProvider {
  create<T extends Object = {}>(model: Eloquent<T>): IEloquentDriver<T>

  findDriverClassName(model: string): string
  findDriverClassName(model: Eloquent<any>): string

  register(driver: string, name: string): void
  register(driver: string, name: string, isDefault: boolean): void
  register(driver: Function, name: string): void
  register(driver: Function, name: string, isDefault: boolean): void

  bind(model: string, name: string): void
}
