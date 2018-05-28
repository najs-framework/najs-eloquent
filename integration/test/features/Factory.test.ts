import 'jest'
import { Eloquent, Factory, Faker, factory } from '../../../dist/lib'
import { User, init_mongoose } from '../../mongodb/index'
import * as Validator from 'validator'

interface ITest {
  name: string
  status: string
  is_test: boolean
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

interface Test extends ITest {}
class Test extends Eloquent<ITest> {
  static className: string = 'Test'
  static timestamps = true
  static softDeletes = true
  static fillable = ['name', 'status', 'is_test']
  static schema = {
    name: { type: String, required: true },
    status: { type: String },
    is_test: { type: Boolean }
  }

  getClassName() {
    return Test.className
  }
}

Factory.define(Test, (faker: Faker, attributes?: Object): Object => {
  return Object.assign(
    {
      name: faker.name()
    },
    attributes
  )
})
Factory.defineAs(Test, 'test', (faker: Faker, attributes?: Object): Object => {
  return Object.assign(
    {
      name: faker.name(),
      is_test: true
    },
    attributes
  )
})
Factory.state(Test, 'tested', () => {
  return {
    status: 'tested'
  }
})
Factory.state(Test, 'testing', () => {
  return {
    status: 'testing'
  }
})

function expectUser(user: User) {
  expect(Validator.isMongoId(user.id)).toBe(true)
  expect(typeof user.first_name).toEqual('string')
  expect(typeof user.last_name).toEqual('string')
  expect(Validator.isEmail(user.email)).toBe(true)
  expect(user.deleted_at).toBeNull()
  expect(typeof user.age).toEqual('number')
}

function expectTest(test: Test) {
  expect(Validator.isMongoId(test.id)).toBe(true)
  expect(typeof test.name).toEqual('string')
  expect(test.deleted_at).toBeNull()
}

describe('Factory', function() {
  beforeAll(async function() {
    await init_mongoose('integration_factory')
  })

  // afterEach(async function () {
  //   await delete_collection(['users'])
  // })

  describe('.make()', function() {
    it('can make an instance of User', function() {
      const testUser = Factory.make(User)
      expectUser(testUser)
    })

    it('can make an instance of Test with status is tested', function() {
      const test = factory(Test)
        .states(['tested'])
        .make()
      expectTest(test)
      expect(test.status).toEqual('tested')
    })

    it('can make an instance of Test with status is testing', function() {
      const test = factory(Test)
        .states(['testing'])
        .make()
      expectTest(test)
      expect(test.status).toEqual('testing')
    })
  })

  describe('.makeAs()', function() {
    it('can make as an instance of Test', function() {
      const test = Factory.makeAs(Test, 'test')
      expectTest(test)
      expect(test.is_test).toBe(true)
    })
  })

  describe('.create()', function() {
    it('can create an instance of User', async function() {
      const testUser = await Factory.create(User)
      expectUser(testUser)
      expect(testUser.created_at instanceof Date).toBe(true)
      expect(testUser.updated_at instanceof Date).toBe(true)
    })

    it('can create an instance of Test with status is tested', async function() {
      const test = await factory(Test)
        .states(['tested'])
        .create()
      expectTest(test)
      expect(test.status).toEqual('tested')
      expect(test.created_at instanceof Date).toBe(true)
      expect(test.updated_at instanceof Date).toBe(true)
    })

    it('can create an instance of Test with status is testing', async function() {
      const test = await factory(Test)
        .states(['testing'])
        .create()
      expectTest(test)
      expect(test.status).toEqual('testing')
      expect(test.created_at instanceof Date).toBe(true)
      expect(test.updated_at instanceof Date).toBe(true)
    })

    it('can create 5 instance of User', async function() {
      const users = await factory(User)
        .times(5)
        .create()
      expect(users.count()).toEqual(5)
    })
  })

  describe('.createAs()', function() {
    it('can create as an instance of Test', async function() {
      const test = await Factory.createAs(Test, 'test')
      expectTest(test)
      expect(test.created_at instanceof Date).toBe(true)
      expect(test.updated_at instanceof Date).toBe(true)
      expect(test.is_test).toBe(true)
    })
  })

  describe('.rawOf()', function() {
    it('can raw of an instance of Test', function() {
      const test = Factory.rawOf(Test, 'test')
      expect(test).toMatchObject({ is_test: true })
    })
  })

  describe('.raw()', function() {
    it('can raw an instance of Test', function() {
      const test = Factory.raw(Test, { name: 'test' })
      expect(test).toMatchObject({ name: 'test' })
      const array = Factory.raw(Test, 10, { name: 'test' })
      for (const item of array) {
        expect(item).toMatchObject({ name: 'test' })
      }
    })
  })
})
