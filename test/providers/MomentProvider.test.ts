import 'jest'
import { Facade } from 'najs-facade'
import { MomentProvider } from '../../lib/providers/MomentProvider'
const moment = require('moment')

describe('MomentProvider', function() {
  it('extends Facade implements Najs.Contracts.Eloquent.MomentProvider contract under name "NajsEloquent.Provider.MomentProvider"', function() {
    const provider = new MomentProvider()
    expect(provider).toBeInstanceOf(Facade)
    expect(provider.getClassName()).toEqual('NajsEloquent.Provider.MomentProvider')
  })

  describe('.make()', function() {
    it('returns the new instance of Moment', function() {
      const provider = new MomentProvider()
      const instance = provider.make()
      expect(moment.isMoment(instance)).toBe(true)
    })
  })

  describe('.isMoment()', function() {
    it('determine that the given object is instance of moment', function() {
      const provider = new MomentProvider()
      const instance = moment()
      expect(provider.isMoment(instance)).toBe(true)
    })
  })

  describe('.setNow()', function() {
    it('simply assigns given cb to moment.now', function() {
      const provider = new MomentProvider()
      const callback = () => moment().toDate()
      expect(provider.setNow(callback) === provider).toBe(true)
      expect(moment.now === callback).toBe(true)
    })
  })
})
