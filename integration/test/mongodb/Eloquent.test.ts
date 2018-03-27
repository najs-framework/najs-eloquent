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
    it('fills the model with an array of attributes.', function() {
      const user = new User()
      user.markFillable('email')
      user.fill({ email: 'test', password: 'test' })
      expect(user.email).toEqual('test')
      expect(user.password).toBeUndefined()
    })
  })

  describe('.forceFill()', function() {
    it('fills the model with an array of attributes. Force mass assignment.', function() {
      const user = new User()
      user.forceFill({ email: 'test', password: 'test' })
      expect(user.email).toEqual('test')
      expect(user.password).toEqual('test')
    })
  })

  describe('.getFillable()', function() {
    it('gets the fillable attributes for the model.', function() {
      const user = new User()
      expect(user.getFillable()).toEqual(['email', 'first_name', 'last_name', 'age'])
    })
  })

  describe('.getGuarded()', function() {
    it('gets the guarded attributes for the model.', function() {
      const user = new User()
      expect(user.getGuarded()).toEqual(['*'])
    })
  })

  describe('.isFillable()', function() {
    it('determines if the given attribute may be mass assigned.', function() {
      const user = new User()
      expect(user.isFillable('email')).toBe(true)
      expect(user.isFillable('password')).toBe(false)
    })
  })

  describe('.isGuarded()', function() {
    it('determines if the given key is guarded.', function() {
      const user = new User()
      expect(user.isGuarded('email')).toBe(true)
      expect(user.isGuarded('password')).toBe(true)
    })
  })

  describe('.getVisible()', function() {
    it('gets the visible attributes for the model..', function() {
      const user = new User()
      expect(user.getVisible()).toEqual([])
    })
  })

  describe('.getHidden()', function() {
    it('gets the hidden attributes for the model.', function() {
      const user = new User()
      expect(user.getHidden()).toEqual(['password'])
    })
  })

  describe('.isVisible()', function() {
    it('determines if the given attribute may be included in JSON.', function() {
      const user = new User()
      expect(user.isVisible('email')).toBe(true)
      expect(user.isVisible('password')).toBe(false)
    })
  })

  describe('.isHidden()', function() {
    it('determines if the given key hidden in JSON.', function() {
      const user = new User()
      expect(user.isHidden('email')).toBe(false)
      expect(user.isHidden('password')).toBe(true)
    })
  })
})
