import { User, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Eloquent functions', function() {
  beforeAll(async function() {
    await init_mongoose('integration_eloquent')
  })

  afterAll(async function() {
    await delete_collection(['users'])
  })

  describe('.id', function() {
    it('can use .id instead of .getId() or setId()', function() {
      const user = new User()
      expect(user.id).toHaveLength(24)
    })
  })

  describe('.getClassName()', function() {
    it("returns model's class name", function() {
      const user = new User()
      expect(user.getClassName()).toEqual('User')
    })
  })

  describe('.fill()', function() {
    it("returns model's class name", function() {
      const user = new User()
      user.markFillable('email')
      expect(user.fill({ email: 'test' }).email).toEqual('test')
    })
  })
})
