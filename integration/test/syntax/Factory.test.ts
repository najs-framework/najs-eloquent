import 'jest'
import { Eloquent, Factory, factory, EloquentDriverProvider, DummyDriver } from '../../../dist/lib'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

describe('Syntax/Factory', function() {
  interface IUser {
    first_name: string
    last_name: string
  }
  class User extends Eloquent<IUser> implements IUser {
    static className = 'SyntaxUser'
    first_name: string
    last_name: string
  }
  Eloquent.register(User)

  interface IPost {
    content: string
  }
  class Post extends Eloquent<IPost> implements IPost {
    static className = 'SyntaxPost'
    content: string

    doSomething(...args: any[]) {}
  }
  Eloquent.register(Post)

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
      factory(User).make().first_name = 'test'
      const lastName = Factory.make(User).last_name

      factory(Post).make().content = lastName
      factory(Post)
        .make()
        .doSomething()
    })
  })
})
