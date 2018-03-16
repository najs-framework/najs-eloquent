export class Record<T> {
  data: T

  constructor(data: T & Object) {
    this.data = data
  }

  static create<T>(data: any): Record<T> {
    const record = new Record<T>(data)
    const proxy = new Proxy(record, {
      get: function(target, key) {
        if (key !== 'data') {
          return target.data[key]
        }
        return target[key]
      },
      set: function(target, key, value) {
        if (key !== 'data') {
          target.data[key] = value
        } else {
          target[key] = value
        }
        return true
      }
    })
    return proxy
  }
}
