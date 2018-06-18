import 'jest'
import { Facade } from 'najs-facade'
import { KnexProvider } from '../../lib/providers/KnexProvider'

describe('KnexProvider', function() {
  it('extends Facade and implements Autoload under name "NajsEloquent.Provider.KnexProvider"', function() {
    const knexProvider = new KnexProvider()
    expect(knexProvider).toBeInstanceOf(Facade)
    expect(knexProvider.getClassName()).toEqual('NajsEloquent.Provider.KnexProvider')
  })

  describe('.setDefaultConfig()', function() {
    it('simply assigns to this.config', function() {
      const knexProvider = new KnexProvider()
      expect(knexProvider.getDefaultConfig()).toBeUndefined()
      const config = {}
      knexProvider.setDefaultConfig(config)
      expect(knexProvider.getDefaultConfig() === config).toBe(true)
    })
  })

  describe('.getDefaultConfig()', function() {
    it('simply returns to this.config', function() {
      const knexProvider = new KnexProvider()
      expect(knexProvider.getDefaultConfig()).toBeUndefined()
      const config = {}
      knexProvider.setDefaultConfig(config)
      expect(knexProvider.getDefaultConfig() === config).toBe(true)
    })
  })

  describe('.create()', function() {
    it('calls knex() with default config, then passes table to the result function', function() {
      const knexProvider = new KnexProvider()
      const config = { client: 'mysql' }
      knexProvider.setDefaultConfig(config)
      const result = knexProvider.create('table')
      expect(result['client']['config'] === config).toBe(true)
      expect(result.toQuery()).toEqual('select * from `table`')
    })

    it('calls knex() with passed config, then passes table to the result function', function() {
      const knexProvider = new KnexProvider()
      const defaultConfig = { client: 'mysql' }
      knexProvider.setDefaultConfig(defaultConfig)

      const config = { client: 'mysql' }
      const result = knexProvider.create('table', config)
      expect(result['client']['config'] === config).toBe(true)
      expect(result.toQuery()).toEqual('select * from `table`')
    })
  })
})
