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

export type DotNotationInfo = {
  first: string
  last: string
  afterFirst: string
  beforeLast: string
  parts: string[]
}

export function parse_string_with_dot_notation(input: string): DotNotationInfo {
  const parts = input.split('.').filter(item => item !== '')
  const result = { first: '', last: '', afterFirst: '', beforeLast: '', parts: parts }
  if (parts.length === 0) {
    return result
  }

  if (parts.length === 1) {
    result.first = parts[0]
    result.last = parts[0]
    result.afterFirst = ''
    result.beforeLast = ''
  } else {
    result.first = parts[0]
    result.last = parts[parts.length - 1]
    result.afterFirst = parts.slice(1).join('.')
    result.beforeLast = parts.slice(0, parts.length - 1).join('.')
  }
  return result
}
