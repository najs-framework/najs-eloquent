/// <reference path="../definitions/utils/IClassSetting.ts" />

import { make, getClassName } from 'najs-binding'

export const CREATE_SAMPLE = 'create-sample'

export class ClassSetting implements NajsEloquent.Util.IClassSetting {
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

  /**
   * Read the setting with given property and the setting reader callback.
   *
   * @param {string} property
   * @param {Function} reader
   */
  read<T>(property: string, reader: NajsEloquent.Util.ISettingReader<T>): T {
    return reader(
      typeof this.definition[property] !== 'undefined' ? this.definition[property] : undefined,
      typeof this.sample[property] !== 'undefined' ? this.sample[property] : undefined,
      typeof this.instance[property] !== 'undefined' ? this.instance[property] : undefined
    )
  }

  /**
   * Get the "sample" instance.
   */
  getSample<T extends Object>(): T {
    return <T>this.sample
  }

  /**
   * Get definition of the class.
   */
  getDefinition(): Function {
    return this.definition
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

  static get(instance: Object, cache: boolean = true): ClassSetting {
    const className = getClassName(instance)
    if (!this.samples[className] || !cache) {
      const sample = make(className, [CREATE_SAMPLE])
      sample['__sample'] = true
      this.samples[className] = new ClassSetting(sample)
      this.samples[className]
    }
    return this.samples[className]
  }

  /**
   * get ClassSetting Reader of an instance with instance's value
   */
  static of(instance: Object): ClassSetting
  static of(instance: Object, cache: boolean): ClassSetting
  static of(instance: Object, cache: boolean = true): ClassSetting {
    return this.get(instance, cache).clone(instance)
  }
}
