/// <reference path="./interfaces/ISettingReader.ts" />

import { make, getClassName } from 'najs-binding'

export const CREATE_SAMPLE = 'create-sample'

export class ClassSetting {
  protected sample: Object
  protected definition: Function
  protected instance: Object

  private constructor()
  private constructor(sample: Object)
  private constructor(sample?: Object) {
    if (sample) {
      this.sample = sample
      this.definition = Object.getPrototypeOf(sample).constructor
    }
  }

  read<T>(property: string, reader: NajsEloquent.Util.ISettingReader<T>): T {
    return reader(
      this.definition[property] ? this.definition[property] : undefined,
      this.sample[property] ? this.sample[property] : undefined,
      this.instance[property] ? this.instance[property] : undefined
    )
  }

  private clone(instance: Object): ClassSetting {
    const replicated = new ClassSetting()
    replicated.sample = this.sample
    replicated.definition = this.definition
    replicated.instance = instance
    return replicated
  }

  /**
   * store ClassSetting instance with "sample"
   */
  protected static samples: Object = {}

  /**
   * get ClassSetting Reader of an instance with instance's value
   */
  static of(instance: Object): ClassSetting
  static of(instance: Object, cache: boolean): ClassSetting
  static of(instance: Object, cache: boolean = true): ClassSetting {
    const className = getClassName(instance)
    if (!this.samples[className] || !cache) {
      this.samples[className] = new ClassSetting(make(className, [CREATE_SAMPLE]))
    }
    return (this.samples[className] as ClassSetting).clone(instance)
  }
}
