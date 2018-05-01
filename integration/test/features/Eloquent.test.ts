import { factory } from '../../../dist/lib'
import { User, init_mongoose, delete_collection } from '../../mongodb/index'
const Moment = require('moment')

describe('Integration Test - Eloquent model functions', function() {
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

  describe('.getAttribute()', function() {
    it('gets an attribute from the model.', async function() {
      const user = await factory(User).create<User>()
      expect(user.getAttribute('email') === user.email).toBe(true)
    })
  })

  describe('.setAttribute()', function() {
    it('sets a given attribute on the model.', async function() {
      const user = new User()
      user.setAttribute('email', 'test')
      expect(user.email).toEqual('test')
    })
  })

  describe('.getPrimaryKey()', function() {
    it('gets the primary key for the model.', async function() {
      const user = new User()
      expect(user.getPrimaryKey().toString()).toEqual(user.id)
    })
  })

  describe('.setPrimaryKey()', function() {
    it('sets the primary key for the model.', async function() {
      // setId() only works for mongoose scheme with option { _id: false }
      const user = new User()
      user.setPrimaryKey('test')
    })
  })

  describe('.markFillable()', function() {
    it('adds temporary fillable attributes for current instance.', async function() {
      const user = new User()
      const instance = new User()

      instance.markFillable('password')
      expect(instance.getFillable()).toEqual(user.getFillable().concat(['password']))
    })
  })

  describe('.markGuarded()', function() {
    it('adds temporary guarded attributes for current instance.', async function() {
      const instance = new User()

      instance.markGuarded('password')
      expect(instance.getGuarded()).toEqual(['password'])
    })
  })

  describe('.markVisible()', function() {
    it('adds temporary visible attributes for current instance.', async function() {
      const user = new User()
      const instance = new User()

      instance.markVisible('password')
      expect(instance.getVisible()).toEqual(user.getVisible().concat(['password']))
    })
  })

  describe('.markHidden()', function() {
    it('adds temporary hidden attributes for current instance.', async function() {
      const user = new User()
      const instance = new User()

      instance.markHidden('email')
      expect(instance.getHidden()).toEqual(user.getHidden().concat(['email']))
    })
  })

  describe('.toObject()', function() {
    it('converts the model instance to a plain object, visible and hidden are not applied.', async function() {
      const user = await factory(User).create<User>({ password: 'test' })
      const plainObject = user.toObject()
      expect(plainObject['_id']).toEqual(user.getPrimaryKey())
      expect(plainObject['__v']).not.toBeUndefined()
      expect(plainObject['password']).not.toBeUndefined()
    })
  })

  describe('.toJSON()', function() {
    it('converts the model instance to JSON object.', async function() {
      const user = await factory(User).create<User>({ password: 'test' })

      const json = user.toJSON()
      expect(json).toEqual({
        id: user.getPrimaryKey().toString(),
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        created_at: user.created_at,
        updated_at: user.updated_at,
        // tslint:disable-next-line
        deleted_at: null
      })
    })
  })

  describe('.toJson()', function() {
    it('converts the model instance to JSON object.', async function() {
      const user = await factory(User).create<User>({ password: 'test' })

      const json = user.toJSON()
      expect(json).toEqual({
        id: user.getPrimaryKey().toString(),
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        created_at: user.created_at,
        updated_at: user.updated_at,
        // tslint:disable-next-line
        deleted_at: null
      })
    })
  })

  describe('.is()', function() {
    it('determines if two models have the same ID and belong to the same table/collection.', async function() {
      const user = await factory(User).create<User>()
      const newUser = new User()
      const freshUser = await user.firstOrFail(user.id)

      expect(user.is(newUser)).toBe(false)
      expect(user.is(freshUser)).toBe(true)
    })
  })

  describe('.touch()', function() {
    it("updates the model's update timestamp.", async function() {
      const user = await factory(User).create<User>()

      const now = new Date(2000, 0, 1)
      Moment.now = () => now

      user.touch()
      await user.save()
      expect(user.updated_at).toEqual(now)
    })
  })

  describe('.save()', function() {
    it('saves the model to the database.', async function() {
      const user = await factory(User).create<User>()

      const now = new Date(2000, 0, 1)
      Moment.now = () => now

      user.touch()
      await user.save()
      expect(user.updated_at).toEqual(now)
    })
  })

  describe('.delete()', function() {
    it('deletes the model from the database.', async function() {
      const user = await factory(User).create()

      expect(await user.onlyTrashed().count()).toBe(0)
      await user.delete()
      expect(await user.onlyTrashed().count()).toBe(1)
      await user.forceDelete()
    })
  })

  describe('.forceDelete()', function() {
    it('forces a hard delete on a soft deleted model.', async function() {
      const user = await factory(User).create<User>()

      expect(await user.onlyTrashed().count()).toBe(0)
      await user.forceDelete()
      expect(await user.onlyTrashed().count()).toBe(0)
    })
  })

  describe('.restore()', function() {
    it('restores a soft deleted model.', async function() {
      const user = await factory(User).create<User>()

      expect(await user.onlyTrashed().count()).toBe(0)
      await user.delete()
      expect(await user.onlyTrashed().count()).toBe(1)
      await user.restore()
      expect(await user.onlyTrashed().count()).toBe(0)
    })
  })

  describe('.fresh()', function() {
    it('reloads a fresh model instance from the database.', async function() {
      const user = await factory(User).create<User>()
      expect(user.is(<User>await user.fresh())).toBe(true)
      expect(await new User().fresh()).toBeNull()
    })
  })
})
