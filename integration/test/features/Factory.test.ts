import 'jest'
import { Faker, Factory } from '../../../dist/lib/v1'
import { User, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Factory usage', function() {
  beforeAll(async function() {
    await init_mongoose('integration_factory')
  })

  afterAll(async function() {
    await delete_collection(['users'])
  })

  describe('Factory.define()', function() {
    it('can be used for defining a factory', function() {
      let definition: any
      Factory.define(
        User.className,
        (definition = (faker: Faker, attributes?: Object): Object => {
          return Object.assign(
            {
              email: faker.email(),
              first_name: faker.first(),
              last_name: faker.last(),
              age: faker.age()
            },
            attributes
          )
        })
      )

      expect(Factory['definitions']['User']['default'] === definition).toBe(true)
    })

    it('used for creates an model instance', async function() {
      // const user: User = await Factory.create<User>(User.className)
      // const result = await user.where('test')
      // const item = (await result.all()).first()
      // item.getFirstName()
      // const result = await user.select().all()
      // result.each(function(item: User) {})
      // if (result) {
      // }
      // const result = await user.select().first()
      // const users = await User.get()
      // console.log(user)
    })
  })
})
