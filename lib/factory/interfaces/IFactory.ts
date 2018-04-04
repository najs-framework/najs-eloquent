import { IFactoryBuilder, IFactoryBuilderCollection } from './IFactoryBuilder'
import { ModelClass } from './IFactoryManager'

export interface IFactory<T> {
  (className: string | ModelClass): IFactoryBuilder<T>
  (className: string | ModelClass, name: string): IFactoryBuilder<T>
  (className: string | ModelClass, amount: number): IFactoryBuilderCollection<T>
  (className: string | ModelClass, name: string, amount: number): IFactoryBuilderCollection<T>
}
