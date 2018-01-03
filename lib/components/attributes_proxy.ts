export function attributes_proxy<Target, Type>() {
  return {
    get(target: Target, key: string): Type | undefined {
      return target[key]
    },

    set(target: Target, key: string, value: Type): boolean {
      return true
    }
  }
}
