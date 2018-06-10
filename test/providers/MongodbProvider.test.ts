import 'jest'
import * as Sinon from 'sinon'
import { MongoClient } from 'mongodb'
import { MongodbProvider } from '../../lib/providers/MongodbProvider'

describe('MongodbProvider', function() {
  it('implements Autoload with class name "NajsEloquent.Provider.MongodbProvider"', function() {
    const provider = new MongodbProvider()
    expect(provider.getClassName()).toEqual('NajsEloquent.Provider.MongodbProvider')
  })

  describe('.connect()', function() {
    it('can connect to mongodb server', async function() {
      const provider = new MongodbProvider()

      expect(provider.getMongoClient()).toBeUndefined()
      expect((await provider.connect('mongodb://localhost:27017')) === provider).toBe(true)
      expect(provider.getMongoClient()).toBeInstanceOf(MongoClient)
    })

    it('throws error if something goes wrong', async function() {
      const provider = new MongodbProvider()
      try {
        await provider.connect('mongodb://localhost:1111')
      } catch (error) {
        return
      }
      expect('should not reach this line').toEqual('hm')
    })
  })

  describe('.close()', function() {
    it('calls this.mongoClient.close() if exists and returns this', async function() {
      const provider = new MongodbProvider()
      expect(provider.close() === provider).toBe(true)

      expect((await provider.connect('mongodb://localhost:27017')) === provider).toBe(true)
      const closeStub = Sinon.stub(provider['mongoClient'], 'close')

      expect(provider.close() === provider).toBe(true)
      expect(closeStub.called).toBe(true)
    })
  })

  describe('.getMongoClient()', function() {
    it('simply returns instance of mongoClient', async function() {
      const provider = new MongodbProvider()

      expect(provider.getMongoClient()).toBeUndefined()
      expect((await provider.connect('mongodb://localhost:27017')) === provider).toBe(true)
      expect(provider.getMongoClient()).toBeInstanceOf(MongoClient)
    })
  })

  describe('.getDatabase()', function() {
    it('simply calls and returns this.mongoClient.db(dbName)', async function() {
      const provider = new MongodbProvider()
      expect(provider.getDatabase()).toBeUndefined()

      expect((await provider.connect('mongodb://localhost:27017')) === provider).toBe(true)
      const dbStub = Sinon.stub(provider['mongoClient'], 'db')
      dbStub.returns('anything')

      expect(provider.getDatabase()).toEqual('anything')
      expect(dbStub.calledWith()).toBe(true)

      dbStub.resetHistory()

      expect(provider.getDatabase('test')).toEqual('anything')
      expect(dbStub.calledWith('test')).toBe(true)
    })
  })
})
