import { get, set, isEqual } from 'lodash'

/**
 * Base class for drivers which are native mongodb or knex. Handles attribute interactions only.
 */
export class Record {
  protected data: object
  protected modified: string[]

  constructor(data?: object | Record) {
    if (data instanceof Record) {
      this.data = data!.data
    } else {
      this.data = data || {}
    }
    this.modified = []
  }

  getAttribute<T>(path: string): T {
    return get(this.data, path)
  }

  setAttribute<T>(path: string, value: T): boolean {
    const originalValue = get(this.data, path)

    if (!isEqual(originalValue, value)) {
      set(this.data, path, value)
      this.markModified(path)
    }

    return true
  }

  getModified(): string[] {
    return this.modified
  }

  markModified(name: string): void {
    if (this.modified.indexOf(name) === -1) {
      this.modified.push(name)
    }
  }

  toObject(): object {
    return this.data
  }
}
