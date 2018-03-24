import { IFactoryBuilder } from './IFactoryBuilder'

export interface IFactory {
  (className: string): IFactoryBuilder
  (className: string, name: string): IFactoryBuilder
}
