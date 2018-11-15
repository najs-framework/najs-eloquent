/// <reference path="../definitions/utils/IClassSetting.ts" />

import { array_unique } from './functions'

export class SettingType {
  static arrayUnique<T>(initializeValue: T[], defaultValue: T[]): NajsEloquent.Util.ISettingReader<T[]> {
    return function(staticValue?: T[], sampleValue?: T[], instanceValue?: T[]): T[] {
      if (!staticValue && !sampleValue && !instanceValue) {
        return defaultValue
      }

      const values: T[] = initializeValue
        .concat(staticValue ? staticValue : [])
        .concat(sampleValue ? sampleValue : [])
        .concat(instanceValue ? instanceValue : [])

      const result = array_unique(values)
      if (result.length === 0) {
        return defaultValue
      }
      return result
    }
  }
}
