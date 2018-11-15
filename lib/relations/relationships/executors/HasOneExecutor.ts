import { HasOneOrManyExecutor } from './HasOneOrManyExecutor'

export class HasOneExecutor<T> extends HasOneOrManyExecutor<T> {
  async executeQuery(): Promise<T | undefined | null> {
    return this.query.first() as any
  }

  executeCollector(): T | undefined | null {
    this.collector.limit(1)
    const result = this.collector.exec()
    if (result.length === 0) {
      return undefined
    }
    return this.dataBucket.makeModel(this.targetModel, result[0]) as any
  }

  getEmptyValue(): T | undefined {
    return undefined
  }
}
