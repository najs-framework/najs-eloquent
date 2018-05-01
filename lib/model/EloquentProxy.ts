export const EloquentProxy = {
  shouldProxy(target: any, key: any) {
    return typeof key !== 'symbol' && target.knownAttributes.indexOf(key) === -1 && target.driver.shouldBeProxied(key)
  },
  get(target: any, key: string) {
    if (this.shouldProxy(target, key)) {
      return target.driver.proxify('get', target, key)
    }
    return target[key]
  },
  set(target: any, key: string, value: any): boolean {
    if (this.shouldProxy(target, key)) {
      return target.driver.proxify('set', target, key, value)
    }
    target[key] = value
    return true
  }
}
