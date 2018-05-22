import 'jest'
import { in_array, parse_string_with_dot_notation } from '../../lib/util/functions'

describe('in_array()', function() {
  it('returns false if haystack is not found', function() {
    expect(in_array('needle')).toBe(false)
  })

  it('returns true if the needle in haystack', function() {
    expect(in_array('a', ['a', 'b'])).toBe(true)
  })

  it('returns false if needle not in haystack', function() {
    expect(in_array('e', ['c', 'd'], ['a', 'b'])).toBe(false)
  })

  it('works with multiple array', function() {
    expect(in_array('a', ['c', 'd'], ['a', 'b'])).toBe(true)
  })
})

describe('parse_string_with_dot_notation()', function() {
  it('works with empty string', function() {
    const result = parse_string_with_dot_notation('')
    expect(result).toEqual({ first: '', last: '', afterFirst: '', beforeLast: '', parts: [] })
  })

  it('works with string has no dot notation', function() {
    const result = parse_string_with_dot_notation('name')
    expect(result).toEqual({ first: 'name', last: 'name', afterFirst: '', beforeLast: '', parts: ['name'] })
  })

  it('works with string has dot notation', function() {
    const dataset = {
      'a.b': { first: 'a', last: 'b', afterFirst: 'b', beforeLast: 'a', parts: ['a', 'b'] },
      'a.b.c': { first: 'a', last: 'c', afterFirst: 'b.c', beforeLast: 'a.b', parts: ['a', 'b', 'c'] },
      'a.b.c.d': { first: 'a', last: 'd', afterFirst: 'b.c.d', beforeLast: 'a.b.c', parts: ['a', 'b', 'c', 'd'] },
      'a..b.c': { first: 'a', last: 'c', afterFirst: 'b.c', beforeLast: 'a.b', parts: ['a', 'b', 'c'] },
      'a..b..c..d': { first: 'a', last: 'd', afterFirst: 'b.c.d', beforeLast: 'a.b.c', parts: ['a', 'b', 'c', 'd'] },
      '...': { first: '', last: '', afterFirst: '', beforeLast: '', parts: [] }
    }

    for (const string in dataset) {
      const result = parse_string_with_dot_notation(string)
      expect(result).toEqual(dataset[string])
    }
  })
})
