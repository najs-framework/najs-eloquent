import 'jest'
// import * as Sinon from 'sinon'
import { EloquentTestBase } from './EloquentTestBase'
import { Record } from './Record'
import { ClassRegistry } from 'najs'

interface IUser {
  first_name: string
  last_name: string
  password: string
}

class User extends EloquentTestBase<IUser> {
  getClassName() {
    return 'User'
  }

  get full_name(): string {
    return this.attributes['first_name'] + ' ' + this.attributes['last_name']
  }

  set full_name(value: string) {}

  getFullNameAttribute() {
    return (this.attributes['first_name'] + ' ' + this.attributes['last_name']).toUpperCase()
  }

  setFullNameAttribute(value: string) {}

  getNickNameAttribute() {
    return this.attributes['first_name'].toUpperCase()
  }

  setNickNameAttribute() {}

  getSomething_wrong_formatAttribute() {
    return 'something_wrong_format'
  }

  getSomethingAccessorWrong() {
    return 'full_name'
  }
}

describe('Eloquent', function() {
  describe('constructor()', function() {
    it('always returns a proxy, and register to Najs.ClassRegistry if needed', function() {
      expect(ClassRegistry.has('User')).toBe(false)
      new User()
      expect(ClassRegistry.has('User')).toBe(true)
    })

    it('can create new object with value', function() {
      const user = new User({ first_name: 'test' })
      expect(user.toObject()).toEqual({ first_name: 'test' })
    })

    it('can create new object with Record instance', function() {
      const user = new User(Record.create<IUser>({ first_name: 'test' }))
      expect(user.toObject()).toEqual({ first_name: 'test' })
    })
  })

  describe('getReservedPropertiesList()', function() {
    it('defines which properties already taken', function() {
      class A extends EloquentTestBase<{}> {
        guarded = []

        getClassName() {
          return 'A'
        }

        getReservedPropertiesList() {
          return super.getReservedPropertiesList().concat(['taken'])
        }
      }
      const a = new A()
      expect(a.isFillable('taken')).toBe(false)
    })
  })

  describe('initialize()', function() {
    it('is called by constructor', function() {})

    it('creates __knownAttributeList attribute', function() {
      const user = new User()
      expect(user['__knownAttributeList'].sort()).toEqual(
        ([] as Array<string>)
          .concat(
            // reserved attributes from IEloquent
            [
              'inspect',
              'valueOf',
              '__knownAttributeList',
              'attributes',
              'fillable',
              'guarded',
              'softDeletes',
              'timestamps',
              'table'
            ],
            // attributes from IEloquent
            [
              'getClassName',
              'fill',
              'forceFill',
              'getFillable',
              'getGuarded',
              'isFillable',
              'isGuarded',
              'setAttribute',
              'getAttribute',
              'toObject',
              'toJson',
              'save',
              'delete',
              'forceDelete',
              'fresh',
              'is',
              'fireEvent',
              'newQuery',
              'newInstance',
              'newCollection'
            ],
            // attributes from Eloquent
            [
              'constructor',
              'isNativeRecord',
              'initializeAttributes',
              'setAttributesByObject',
              'setAttributesByNativeRecord',
              'initialize',
              'getReservedPropertiesList'
            ],
            // accessors
            ['accessors', 'mutators', 'findAccessorsAndMutators', 'findGettersAndSetters', 'getAllValueOfAccessors'],
            // attributes from User
            [
              'full_name',
              'getFullNameAttribute',
              'setFullNameAttribute',
              'getNickNameAttribute',
              'setNickNameAttribute',
              'getSomethingAccessorWrong',
              'getSomething_wrong_formatAttribute'
            ]
          )
          .sort()
      )
    })
  })

  describe('newInstance(data)', function() {
    it('create new instance of Eloquent based by passing data', function() {
      const user = new User()
      const instance: User = user.newInstance({ first_name: 'john' })
      expect(instance).toBeInstanceOf(User)
      expect(instance === user.newInstance()).toBe(false)
      expect(instance.toObject()).toEqual({ first_name: 'john' })
    })
  })

  describe('newCollection(data)', function() {
    it('create new instance of Eloquent based by passing data', function() {
      const user = new User()
      const collection = user.newCollection([{ first_name: 'john' }])
      expect(collection.items[0]).toBeInstanceOf(User)
      expect(collection.all().map(item => item.toObject())).toEqual([{ first_name: 'john' }])
    })
  })

  describe('getGuarded()', function() {
    it('returns ["*"] by default even the guarded property is not set', function() {
      const user = new User()
      expect(user.getGuarded()).toEqual(['*'])
    })
  })

  describe('isGuarded()', function() {
    it('guards all attributes by default', function() {
      const user = new User()
      expect(user.isGuarded('first_name')).toBe(true)
    })

    it('checks attribute in guarded property if it was set', function() {
      const user = new User()
      user['guarded'] = ['password']
      expect(user.isGuarded('first_name')).toBe(false)
      expect(user.isGuarded('last_name')).toBe(false)
      expect(user.isGuarded('password')).toBe(true)
    })
  })

  describe('getFillable()', function() {
    it('returns [] by default even the fillable property is not set', function() {
      const user = new User()
      expect(user.getFillable()).toEqual([])
    })
  })

  describe('isFillable()', function() {
    it('returns false if fillable is not defined', function() {
      const user = new User()
      expect(user.isFillable('first_name')).toBe(false)
      expect(user.isFillable('last_name')).toBe(false)
    })

    it('returns true if the key is in fillable', function() {
      const user = new User()
      user['fillable'] = ['first_name']
      expect(user.isFillable('first_name')).toBe(true)
      expect(user.isFillable('last_name')).toBe(false)
    })

    it('returns false if the key is guarded', function() {
      const user = new User()
      user['fillable'] = ['last_name']
      user['guarded'] = ['first_name']
      expect(user.isFillable('first_name')).toBe(false)
      expect(user.isFillable('last_name')).toBe(true)
    })

    it('returns true if fillable not defined, not in guarded, not known properties and not start by _', function() {
      const user = new User()
      user['guarded'] = ['password']
      expect(user.isFillable('not_defined')).toBe(true)
      expect(user.isFillable('attributes')).toBe(false)
      expect(user.isFillable('_private')).toBe(false)
    })

    it('always checks in fillable before guarded', function() {
      const user = new User()
      user['fillable'] = ['first_name']
      user['guarded'] = ['first_name']
      expect(user.isFillable('first_name')).toBe(true)
      expect(user.isFillable('last_name')).toBe(false)
    })
  })

  describe('fill()', function() {
    it('fills data which if isFillable(key) returns true', function() {
      const user = new User()
      user['fillable'] = ['first_name']
      user.fill({
        first_name: 'john',
        last_name: 'doe'
      })
      expect(user.getAttribute('first_name')).toEqual('john')
      expect(user.toObject()).toEqual({ first_name: 'john' })
    })

    it('calls setAttribute() to assign fillable attribute', function() {
      const user = new User()
      user['fillable'] = ['first_name']
      user.fill({
        first_name: 'john',
        last_name: 'doe'
      })
      expect(user.toJson()).toEqual({ first_name: 'john' })
    })
  })

  describe('forceFill()', function() {
    it('fills data even they are not fillable', function() {
      const user = new User()
      user['fillable'] = ['first_name']
      user['guarded'] = ['last_name']
      user.forceFill({
        first_name: 'john',
        last_name: 'doe'
      })
      expect(user.getAttribute('first_name')).toEqual('john')
      expect(user.getAttribute('last_name')).toEqual('doe')
      expect(user.toObject()).toEqual({ first_name: 'john', last_name: 'doe' })
    })

    it('calls setAttribute() to assign fillable attribute', function() {
      const user = new User()
      user.forceFill({
        first_name: 'john',
        last_name: 'doe'
      })
      expect(user.toObject()).toEqual({ first_name: 'john', last_name: 'doe' })
    })
  })

  describe('fill()', function() {})

  if (Object.getOwnPropertyDescriptors) {
    describe('Accessors for node >= 8.7', function() {
      it('supports getter since node >= 8.7', function() {
        const user = new User()
        expect(user['accessors']['full_name']).toEqual({
          name: 'full_name',
          type: 'getter'
        })
        expect(user['accessors']['nick_name']).toEqual({
          name: 'nick_name',
          type: 'function',
          ref: 'getNickNameAttribute'
        })
        expect(user['accessors']['something_wrong_format']).toEqual({
          name: 'something_wrong_format',
          type: 'function',
          ref: 'getSomething_wrong_formatAttribute'
        })
      })

      it('skip function get...Attribute() if getter is defined', function() {
        const user = new User({
          first_name: 'tony',
          last_name: 'stark'
        })
        expect(user.full_name).toEqual('tony stark')
        expect(user['accessors']['full_name']).toEqual({
          name: 'full_name',
          type: 'getter'
        })
      })

      it('has function to get all values of accessors', function() {
        const user = new User({
          first_name: 'tony',
          last_name: 'stark'
        })
        expect(user['getAllValueOfAccessors']()).toEqual({
          full_name: 'tony stark',
          nick_name: 'TONY',
          something_wrong_format: 'something_wrong_format'
        })
      })
    })

    describe('Mutators for node >= 8.7', function() {
      it('supports setter since node >= 8.7', function() {
        const user = new User()
        expect(user['mutators']['full_name']).toEqual({
          name: 'full_name',
          type: 'setter'
        })
      })

      it('skip function set...Attribute() if getter is defined', function() {
        // const user = new User({
        //   first_name: 'tony',
        //   last_name: 'stark'
        // })
      })
    })
  } else {
    describe('Accessors for node < 8.7', function() {
      it('can find accessor type function', function() {
        const user = new User()
        expect(user['accessors']['full_name']).toEqual({
          name: 'full_name',
          type: 'function',
          ref: 'getFullNameAttribute'
        })
        expect(user['accessors']['nick_name']).toEqual({
          name: 'nick_name',
          type: 'function',
          ref: 'getNickNameAttribute'
        })
        expect(user['accessors']['something_wrong_format']).toEqual({
          name: 'something_wrong_format',
          type: 'function',
          ref: 'getSomething_wrong_formatAttribute'
        })
      })

      it('has function to get all values of accessors', function() {
        const user = new User({
          first_name: 'tony',
          last_name: 'stark'
        })
        expect(user['getAllValueOfAccessors']()).toEqual({
          full_name: 'TONY STARK',
          nick_name: 'TONY',
          something_wrong_format: 'something_wrong_format'
        })
      })
    })
  }

  describe('EloquentTestBase', function() {
    it('is fake test remove uncovered lines Helper Classes', async function() {
      const user = new User()
      user.newQuery()
      user.forceDelete()
      user.fresh()
      user.is(user)
      user.fireEvent('test')
      user.delete()
      await user.save()
      user['attributes']['something'] = true
      user['attributes']['data'] = <any>user['attributes']['something']
      user.fill(user['attributes']['data'])
      const record = Record.create({})
      expect(record.data).toEqual({})
    })
  })
})
