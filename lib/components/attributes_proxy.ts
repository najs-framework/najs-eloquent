export function attributes_proxy() {
  return {
    get(target: any, key: string): any {
      if (target['__knownAttributeList'].indexOf(key) === -1) {
        return target['getAttribute'].call(target, key)
      }
      return target[key]
    },

    set(target: any, key: string, value: any): boolean {
      if (target['__knownAttributeList'].indexOf(key) === -1) {
        return target['setAttribute'].call(target, key, value)
      }
      return true
    }
  }
}
