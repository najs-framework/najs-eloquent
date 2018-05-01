import 'jest'
import { SettingType } from '../../lib/util/SettingType'

describe('SettingType', function() {
  describe('.arrayUnique()', function() {
    it('returns a SettingReader function', function() {
      expect(typeof SettingType.arrayUnique([], [])).toEqual('function')
    })

    it('returns defaultValue if all value types are undefined', function() {
      const func = SettingType.arrayUnique([], <any>'default')

      expect(func()).toEqual('default')
    })

    it('joins "static" value if it not exists', function() {
      const func = SettingType.arrayUnique<string>([], [])

      expect(func(['static'])).toEqual(['static'])
    })

    it('joins "sample" value if it not exists', function() {
      const func = SettingType.arrayUnique<string>([], [])

      expect(func(undefined, ['sample'])).toEqual(['sample'])
    })

    it('joins "instance" value if it not exists', function() {
      const func = SettingType.arrayUnique<string>([], [])

      expect(func(undefined, undefined, ['instance'])).toEqual(['instance'])
    })

    it('remove duplicated after join all types of values', function() {
      const func = SettingType.arrayUnique<string>([], [])

      expect(func(['a'], ['a', 'b', 'c'], ['b', 'c'])).toEqual(['a', 'b', 'c'])
    })

    it('returns default value if the result has length 0', function() {
      const func = SettingType.arrayUnique<string>([], ['default'])

      expect(func([], undefined, [])).toEqual(['default'])
    })

    it('can be set the initialize value before joins types of value', function() {
      const func = SettingType.arrayUnique<string>(['a'], ['default'])

      expect(func(['b'], undefined, ['c'])).toEqual(['a', 'b', 'c'])
    })
  })
})
