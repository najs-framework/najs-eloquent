# <img src="https://raw.githubusercontent.com/najs-framework/najs-eloquent/master/najs-eloquent.png" alt="najs-eloquent">

> ORM written in Typescript, inspired by Laravel Eloquent, supports Mongodb/Mongoose.

[![Travis](https://img.shields.io/travis/najs-framework/najs-eloquent/master.svg?style=flat-square)](https://travis-ci.org/najs-framework/najs-eloquent/builds)
[![Maintainability](https://api.codeclimate.com/v1/badges/94de4189d6396eda8c0a/maintainability)](https://codeclimate.com/github/najs-framework/najs-eloquent/maintainability)
[![Coverage Status](https://img.shields.io/coveralls/najs-framework/najs-eloquent/master.svg?style=flat-square)](https://coveralls.io/r/najs-framework/najs-eloquent?branch=master)
[![node version](https://img.shields.io/node/v/najs-eloquent.svg?style=flat-square)](https://nodejs.org/en/download/)
[![npm version](https://img.shields.io/npm/v/najs-eloquent.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![npm downloads](https://img.shields.io/npm/dm/najs-eloquent.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![npm license](https://img.shields.io/npm/l/najs-eloquent.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> _Warning: This is a documentation for v0.4.x, if you are using v0.3.x please checkout readme for [v0.3.x in here](https://github.com/najs-framework/najs-eloquent/blob/master/README-v3.md)._

If you are Laravel Eloquent lover and want to use it in `Node JS` you will love `Najs Eloquent`. `Najs Eloquent` is Laravel Eloquent, written in `Typescript`.

## Installation

Add `najs-binding`, `najs-eloquent`

```bash
yarn add najs-binding najs-eloquent
```

or

```bash
npm install najs-binding najs-eloquent
```

That's it.

## Drivers

NajsEloquent runs with Memory driver by default that means all data is saved in memory. There are some available drivers that you can use

- [mongoose](https://github.com/najs-framework/najs-eloquent-mongoose)

> **I'm writing detail documentation, please try the library and give me a hand if you can.**

## Quick Usage

### I. Define a model

Simply create new class extends from a `Model` class

```typescript
import { Model } from 'najs-eloquent'

export class User extends Model {
  // define a property belongs to User model
  email: string

  // define a class name which used for Dependency injection
  // (this feature provided by "najs-binding" package)
  getClassName() {
    return 'YourNamespace.User'
  }
}

// Register the User class
Model.register(User)
```

### II. Querying

You can query entries from database via static Query or instance query via `.newQuery()`.

Retrieve entries via static query

```typescript
const result = await User.where('id', '>', 10).get()
```

Retrieve entries via instance query

```typescript
const result = new User()
  .newQuery()
  .where('id', '>', 10)
  .get()
```

You can build grouped query via sub-query, like this

```typescript
// a = 1 AND (b = 2 OR c = 3)
const result = await User.where('a', 1)
  .where(function(subQuery) {
    subQuery.where('b', 2).orWhere('c', 3)
  })
  .get()
```

All querying functions support auto-completed/auto-suggestion to help you prevent any typo mistake. If you are familiar with Laravel Query Builder you can start write query without learning anything.

### III. ActiveRecord - Create, Update & Delete

Create new model

```typescript
const user = new User()
user.email = 'email@test.com'
await user.save()
```

Update a model

```typescript
const user = await User.firstOrFail('id')
user.email = 'email@test.com'
await user.save()
```

Delete a model

```typescript
const user = await User.firstOrFail('id')
await user.delete()

// or you can use query builder
await User.where('id', 'deleted-id').delete()
```

### IV. Accessors and Mutators

#### Accessors

You can define an accessor by `getter` or a function like Laravel Eloquent

```typescript
// file: Accessor.ts
import { Model } from 'najs-eloquent'

export class User extends Model {
  get full_name() {
    return this.attributes['first_name'] + ' ' + this.attributes['last_name']
  }

  // Laravel Eloquent style, available for node > 6.x
  // If you define this function AND getter, this function will be skipped
  getFullNameAttribute() {
    return this.attributes['first_name'] + ' ' + this.attributes['last_name']
  }
}
```

#### Mutators

You can define a mutator by `setter` or a function like Laravel Eloquent

```typescript
// file: Mutator.ts
import { Model } from 'najs-eloquent'

export class User extends Model {
  set full_name(value: any) {
    // ...
  }

  // Laravel Eloquent style, available for node > 6.x
  // If you define this function AND setter, this function will be skipped
  setFullNameAttribute(value: any) {
    // ...
  }
}
```

### V. Settings Properties

#### `fillable` & `guarded`

Just like Laravel, you can define mass assignable fields by `fillable` or `guarded` property

```typescript
export class User extends Model {
  protected fillable = ['email', 'username']

  // This way also works :)
  // static fillable = ['email', 'username']
}
```

Only defined properties in fillable can be filled with `.fill()`

```typescript
const user = new User()
user.fill({ email: 'a', password: 'x' })

console.log(user.toObject()) // => { email: a }
```

You can skip `fillable` setting by using `.forceFill()`

#### `visible` & `hidden`

You can define serialized fields by `visible` or `hidden` property

```typescript
export class User extends Model {
  protected fillable = ['email', 'username']
  protected hidden = ['password']

  // This way also works :)
  // static hidden = ['password']
}
```

When using `.toObject()` or `.attributesToObject()` the `password` field will be skipped

```typescript
const user = new User()
user.forceFill({ email: 'a', password: 'x' })

console.log(user.toObject()) // => { email: a }
```

#### `timestamps`

You can simply define timestamps for models by changing static (or protected) variable named `timestamps`. By using this feature every time the model get saved, `created_at` and `updated_at` will updated automatically

```typescript
export class User extends Model {
  protected timestamps = true

  // This way also works :)
  // static timestamps = true
}
```

By default, Najs Eloquent will create 2 fields named `created_at` and `updated_at`, you can custom the fields' name:

```typescript
export class User extends Model {
  protected timestamps = { createdAt: 'created', updatedAt: 'updated' }

  // This way also works :)
  // static timestamps = { createdAt: 'created', updatedAt: 'updated' }
}
```

#### `softDeletes`

You can simply define soft deletes feature for models by changing static (or protected) variable named `softDeletes`.

```typescript
export class User extends Model {
  protected softDeletes = true

  // This way also works :)
  // static softDeletes = true
}
```

By using this feature every time the model get deleted the data ind database not actually deleted, it update `deleted_at` from `null` to date object. You can custom the `deleted_at` field name:

```typescript
export class User extends Model {
  protected softDeletes = { deletedAt: 'deleted' }

  // This way also works :)
  // static softDeletes = { deletedAt: 'deleted' }
}
```

With soft deletes model all retrieve operators like `find()` or `get()` automatically return non-deleted entries only, you can use `.withTrashed()` or `.onlyTrashed()` to receive deleted entries

```typescript
const users = await User.withTrashed().get()
```

### VI. Events

You can listen to events `creating`, `created`, `saving`, `saved`, `updating`, `updated`, `deleting`, `deleted`, `restoring`, `restored` by using `.on()` or just trigger for 1 event only by `.once()`. All event listener is async

```typescript
const user = new User()
user.on('created', async function(createdModel: User) {
  // ...
})
user.email = '...'
user.save()
```

You can listen to global event like this

```typescript
User.on('created', function(createdModel: any) {
  // ...
})
```

### VII. Relationships

`najs-eloquent` supports `HasOne`, `HasMany`, `ManyToMany`, `MorphOne` and `MorphMany` relationships. This feature doesn't look like Laravel. We couldn't give the same name the data and relation in Typescript, then you have to separate it

```typescript
import { Model, HasMany, BelongsTo } from 'najs-eloquent'

class User extends Model {
  // Define property "posts" which receive data from relation "postsRelation"
  posts: HasMany<Post>

  // Define property "postsRelation" which handle this relationship
  get postsRelation() {
    return this.defineRelation('posts').hasMany(Post)
  }
}

class Post extends Model {
  // define property which is foreign key and point to User model
  user_id: string

  // Inverse relation data property
  user: BelongsTo<User>

  // Define inverse relation
  get userRelation() {
    return this.defineRelation('user').belongsTo(User)
  }
}
```

So we can assign new Post to user like this

```typescript
const post = new Post()
const user = new User()
user.postsRelation.associate(post)

// when you save the user model, post will be saved and associate to User automatically
await user.save()

// eager load posts when loading users
const result = await User.with('posts').firstOrFail()
console.log(result.posts) // a collection of posts belongs to current user

// lazy load posts from user
await user.postsRelation.lazyLoad()

// or just load relation, najs-eloquent uses eager loading if possible
await user.load('posts')
```

> **I'm writing detail documentation, please try the library and give me a hand if you can.**

### VIII. Factory

`najs-eloquent` has Factory feature which use [`chance`](http://chancejs.com) as a faker:

```typescript
import { Factory, factory } from 'najs-eloquent'
import { User } from 'somewhere...'

// define a factory for User model
Factory.define(User, function(faker, attributes) {
  return Object.assign(
    {
      email: faker.email()
    },
    attributes
  )
})

// create model and save to database by factory()
await factory(User).create()

// make model instance only by factory()
const fakeUser = factory(User).make()

// make 3 model instances by factory()
const fakeUsers = factory(User)
  .times(3)
  .make()
```

### IX. Builtin classes

All classes you need to implement new driver are available in `NajsEloquent` object.

> **I'm writing detail documentation, please try the library and give me a hand if you can.**

## Contribute

PRs are welcomed to this project, and help is needed in order to keep up with the changes of Laravel Eloquent. If you want to improve the library, add functionality or improve the docs please feel free to submit a PR.

## Sponsors

If you want to become a sponsor please [let me know](mailto:nhat@ntworld.net).

You can buy me a beer via [Paypal](https://paypal.me/beerfornhat) or [Patreon](https://patreon.com/nhat).

Thanks in advance!

## License

MIT © Nhat Phan
