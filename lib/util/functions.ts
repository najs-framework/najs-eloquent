import { flatten } from 'lodash'

/**
 * Check the given key is in the array or not
 *
 * @param {mixed} key
 * @param {mixed[]} args
 */
export function in_array<T>(key: T, ...args: T[][]): boolean {
  for (const array of args) {
    if (array.indexOf(key) !== -1) {
      return true
    }
  }
  return false
}

/**
 * Return new array which filter duplicated item in given array.
 *
 * @param {mixed[]} array
 */
export function array_unique<T>(...array: Array<T[] | ArrayLike<any>>): T[] {
  return Array.from(new Set(flatten(array)))
}

export function find_base_prototypes(prototype: Object, root: Object): Object[] {
  const bases: Object[] = []
  let count = 0
  do {
    prototype = Object.getPrototypeOf(prototype)
    bases.push(prototype)
    count++
  } while (count < 100 && (typeof prototype === 'undefined' || prototype !== root))
  return bases
}
