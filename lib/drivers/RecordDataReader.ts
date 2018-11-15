/// <reference path="../definitions/data/IDataReader.ts" />

import { pick } from 'lodash'
import { Record } from './Record'
import { isObjectId } from '../util/helpers'

export const RecordDataReader: NajsEloquent.Data.IDataReader<Record> = {
  getAttribute(data: Record, field: string) {
    return this.toComparable(data.getAttribute(field))
  },

  pick(record: Record, selectedFields: string[]): Record {
    const data = record.toObject()

    return new Record(pick(data, selectedFields))
  },

  toComparable(value: any) {
    return isObjectId(value) ? (value as any).toHexString() : value
  }
}
