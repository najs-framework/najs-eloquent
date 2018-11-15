import 'jest'
import { register } from 'najs-binding'
import { Model, Factory, factory } from '../../lib'

describe('Syntax/Factory', function() {
  interface IUser {
    first_name: string
    last_name: string
  }
  class User extends Model implements IUser {
    static className = 'SyntaxUser'
    first_name: string
    last_name: string
  }
  register(User)

  interface IPost {
    content: string
  }
  class Post extends Model implements IPost {
    static className = 'SyntaxPost'
    content: string

    doSomething(...args: any[]) {}
  }
  register(Post)

  Factory.define(User, function(faker) {
    return {}
  })
  Factory.define(Post, function(faker) {
    return {}
  })

  describe('Factory', function() {
    it('can be detect which Model is using without GenericType', function() {
      Factory.make(User).first_name = 'test'
      const lastName = Factory.make(User).last_name

      Factory.make(Post).content = lastName
      Factory.make(Post).doSomething()
    })
  })

  describe('factory()', function() {
    it('can be detect which Model is using without GenericType', function() {
      factory(User).make().first_name

      factory(User).make().first_name = 'test'
      const lastName = Factory.make(User).last_name

      factory(Post).make().content = lastName
      factory(Post)
        .make()
        .doSomething()
    })

    it('should detect the collection or singular model base on amount argument', function() {
      factory(User).make().first_name = 'test'

      factory(User, 2)
        .make()
        .map(item => item.attributesToObject())

      factory(User, 'default').make().first_name = 'test'

      factory(User, 'default', 2)
        .make()
        .map(item => item.attributesToObject())
    })
  })
})
