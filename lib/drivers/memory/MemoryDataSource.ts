import { register } from 'najs-binding'
import { ObjectId } from 'bson'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'
import { Record } from '../Record'
import { RecordDataSourceBase } from '../RecordDataSourceBase'

export class MemoryDataSource extends RecordDataSourceBase {
  static className: string = NajsEloquentClasses.Driver.Memory.MemoryDataSource

  getClassName(): string {
    return NajsEloquentClasses.Driver.Memory.MemoryDataSource
  }

  createPrimaryKeyIfNeeded(data: Record): string {
    const primaryKey = data.getAttribute<string>(this.primaryKeyName)
    if (primaryKey) {
      return primaryKey
    }

    const newId = new ObjectId().toHexString()
    data.setAttribute(this.primaryKeyName, newId)

    return newId
  }

  async read(): Promise<boolean> {
    return true
  }

  async write(): Promise<boolean> {
    return true
  }
}
register(MemoryDataSource, NajsEloquentClasses.Driver.Memory.MemoryDataSource)
