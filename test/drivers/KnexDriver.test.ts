import 'jest'
import { init_knex, knex_run_sql } from '../util'
import { Eloquent } from '../../lib/model/Eloquent'
import { register } from 'najs-binding'
import { KnexDriver } from '../../lib/drivers/KnexDriver'
import { RecordBaseDriver } from '../../lib/drivers/based/RecordDriverBase'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'

EloquentDriverProvider.register(KnexDriver, 'knex')

interface IUser {
  email: string
  first_name: string
  last_name: string
  age: 20
}

class User extends Eloquent<IUser> {
  static className: string = 'User'
  static fillable = ['email', 'first_name', 'last_name', 'age']
  getClassName() {
    return User.className
  }
}
register(User)

describe('KnexDriver', function() {
  let modelInstance: any = undefined

  beforeAll(async function() {
    await init_knex('najs_eloquent_knex_driver')
    await knex_run_sql(
      `CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        age INT,
        PRIMARY KEY (id)
      )`
    )
    modelInstance = new User()
  })

  it('extends RecordBaseDriver and implements Autoload under name "NajsEloquent.Driver.KnexDriver"', function() {
    const driver = new KnexDriver(modelInstance)
    expect(driver).toBeInstanceOf(RecordBaseDriver)
    expect(driver.getClassName()).toEqual('NajsEloquent.Driver.KnexDriver')
  })

  describe('.shouldBeProxied()', function() {
    it('returns true if the key is not "table"', function() {
      const driver = new KnexDriver(modelInstance)
      expect(driver.shouldBeProxied('a')).toBe(true)
      expect(driver.shouldBeProxied('b')).toBe(true)
      expect(driver.shouldBeProxied('test')).toBe(true)
      expect(driver.shouldBeProxied('table')).toBe(false)
    })
  })

  describe('.getRecordName()', function() {
    it('returns this.tableName', function() {
      const driver = new KnexDriver(modelInstance)
      expect(driver.getRecordName()).toEqual('users')

      driver['tableName'] = 'anything'
      expect(driver.getRecordName()).toEqual('anything')
    })
  })
})
