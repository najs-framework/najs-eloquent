import 'jest'
import * as Sinon from 'sinon'
import { Facade } from 'najs-facade'
import { KnexProvider } from '../../lib/providers/KnexProvider'

describe('KnexProvider', function() {
  it('extends Facade and implements Autoload under name "NajsEloquent.Provider.KnexProvider"', function() {
    const knexProvider = new KnexProvider()
    expect(knexProvider).toBeInstanceOf(Facade)
    expect(knexProvider.getClassName()).toEqual('NajsEloquent.Provider.KnexProvider')
  })

  describe('.setConfig()', function() {
    it('simply assigns to this.configurations[name]', function() {
      const knexProvider = new KnexProvider()
      expect(knexProvider.getConfig('test')).toBeUndefined()
      const config = {}
      expect(knexProvider.setConfig('test', config) === knexProvider).toBe(true)
      expect(knexProvider.getConfig('test') === config).toBe(true)
    })

    it('clears instance in this.instances[name] instance', function() {
      const knexProvider = new KnexProvider()
      knexProvider['instances']['test'] = <any>{}
      knexProvider.setConfig('test', {})
      expect(knexProvider['instances']['test']).toBeUndefined()
    })
  })

  describe('.getConfig()', function() {
    it('simply returns config from this.configurations', function() {
      const knexProvider = new KnexProvider()
      const config = {}
      knexProvider['configurations']['test'] = config
      expect(knexProvider.getConfig('test') === config).toBe(true)
    })
  })

  describe('.setDefaultConfig()', function() {
    it('calls .setConfig() with name = default', function() {
      const knexProvider = new KnexProvider()
      const setConfigStub = Sinon.stub(knexProvider, 'setConfig')
      const config = {}
      knexProvider.setDefaultConfig(config)
      expect(setConfigStub.calledWith('default', config)).toBe(true)
    })
  })

  describe('.getDefaultConfig()', function() {
    it('calls and returns this.getConfig() with name = default', function() {
      const knexProvider = new KnexProvider()
      expect(knexProvider.getDefaultConfig()).toBeUndefined()
      const config = {}
      knexProvider.setDefaultConfig(config)
      expect(knexProvider.getDefaultConfig() === config).toBe(true)
    })
  })

  describe('.create()', function() {
    it('calls knex() with default config and cached the result in this.instances if the config param is not passed', function() {
      const knexProvider = new KnexProvider()
      const config = { client: 'mysql' }
      knexProvider.setDefaultConfig(config)
      const result = knexProvider.create()
      expect(result === knexProvider['instances']['default']).toBe(true)
      expect(result['client']['config'] === config).toBe(true)
      expect(knexProvider.create() === result).toBe(true)
    })

    it('calls Knex() and creates instance if the first argument is object, this instance is not cached', function() {
      const knexProvider = new KnexProvider()
      const config = { client: 'mysql' }

      const a = knexProvider.create(config)
      const b = knexProvider.create(config)
      expect(a !== b).toBe(true)
    })

    it('creates cached instance by config with name', function() {
      const knexProvider = new KnexProvider()
      const config = { client: 'mysql' }
      knexProvider.setConfig('test', config)
      const result = knexProvider.create('test')
      expect(result === knexProvider['instances']['test']).toBe(true)
      expect(knexProvider.create('test') === result).toBe(true)
      expect(result['client']['config'] === config).toBe(true)
    })

    it('sets config by name then creates a cached instance at the same time', function() {
      const knexProvider = new KnexProvider()
      const config = { client: 'mysql' }
      const result = knexProvider.create('test', config)
      expect(config === knexProvider['configurations']['test']).toBe(true)
      expect(result === knexProvider['instances']['test']).toBe(true)
      expect(knexProvider.create('test') === result).toBe(true)
      expect(result['client']['config'] === config).toBe(true)
    })
  })

  describe('.createQueryBuilder()', function() {
    it('calls .create() and passes arg1, arg2, then passes table to the result function', function() {
      const knexProvider = new KnexProvider()
      const config = { client: 'mysql' }
      knexProvider.setDefaultConfig(config)
      const result = knexProvider.createQueryBuilder('table')
      expect(result['client']['config'] === config).toBe(true)
      expect(result.toQuery()).toEqual('select * from `table`')
    })

    it('calls .create() with passed config, then passes table to the result function', function() {
      const knexProvider = new KnexProvider()
      const defaultConfig = { client: 'mysql' }
      knexProvider.setDefaultConfig(defaultConfig)

      const config = { client: 'mysql' }
      const result = knexProvider.createQueryBuilder('table', config)
      expect(result['client']['config'] === config).toBe(true)
      expect(result.toQuery()).toEqual('select * from `table`')
    })
  })
})
