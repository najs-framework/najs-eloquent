# <img src="https://raw.githubusercontent.com/najs-framework/najs-eloquent/master/najs-eloquent.png" alt="najs-eloquent">

> ORM written in Typescript, inspired by Laravel Eloquent, supports Mongodb/Mongoose.

[![Travis](https://img.shields.io/travis/najs-framework/najs-eloquent/master.svg?style=flat-square)](https://travis-ci.org/najs-framework/najs-eloquent/builds)
[![Coverage Status](https://img.shields.io/coveralls/najs-framework/najs-eloquent/master.svg?style=flat-square)](https://coveralls.io/r/najs-framework/najs-eloquent?branch=master)
[![node version](https://img.shields.io/node/v/najs-eloquent.svg?style=flat-square)](https://nodejs.org/en/download/)
[![npm version](https://img.shields.io/npm/v/najs-eloquent.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![npm downloads](https://img.shields.io/npm/dm/najs-eloquent.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![npm license](https://img.shields.io/npm/l/najs-eloquent.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

If you are Laravel Eloquent lover and want to use it in `Node JS` you will love `Najs Eloquent`. `Najs Eloquent` is
Laravel Eloquent, written in `Typescript` (with some helpers you can use it in Javascript for sure).

Current version - `0.2.4` - is targeted to Mongodb only (using ORM Mongoose as a backer). Because MongoDB is not RDB
some features of Laravel Eloquent are removed such as relationship or scope. In the way to `1.0.0`, the `Najs Eloquent`
will support full Eloquent's features with difference kinds of DB like `MySql`, `PostgreSQL` or `SqlLite`
(use `knex` as a query builder).

You can take a look on fully setup example in [najs-eloquent-example](https://github.com/najs-framework/najs-eloquent-example) repository or try it in [Playground](http://35.196.114.98/ide.html).

# Installation

Add `najs`, `najs-eloquent` and `mongoose` to dependencies

```bash
yarn add najs najs-eloquent mongoose

# or

npm install najs najs-eloquent mongoose
```

Register `MongooseProvider`. WARNING: Class name is so important, it must be MongooseProvider

```typescript
// file: MongooseProvider.ts
import { register } from 'najs'
import { IMongooseProvider } from 'najs-eloquent'
const mongoose = require('mongoose')

@register() // register MongooseProvider with 'MongooseProvider' name
class MongooseProvider implements IMongooseProvider {
  static className: string = 'MongooseProvider'

  getClassName() {
    return MongooseProvider.className
  }

  getMongooseInstance() {
    return mongoose
  }
}
```

You can use another class but is must implement IMongooseProvider and register under "**MongooseProvider**" name,
for example

```typescript
// file: CustomClass.ts
import { register } from 'najs'
import { IMongooseProvider } from 'najs-eloquent'
const mongoose = require('mongoose')

class CustomClass implements IMongooseProvider {
  static className: string = 'CustomClass'

  getClassName() {
    return CustomClass.className
  }

  getMongooseInstance() {
    return mongoose
  }
}

// It must be registered under name "MongooseProvider"
register(CustomClass, 'MongooseProvider')
```

# Example

Please checkout fully setup example in [najs-eloquent-example](https://github.com/najs-framework/najs-eloquent-example) repository or try it in [Playground](http://35.196.114.98/ide.html).

# Usage

## I. Defining Models

### Create model for `Mongodb` using `Mongoose`

```typescript
// file: User.ts
import Eloquent from 'najs-eloquent'
import { Schema } from 'mongoose'

// This interface can be shared between Server-side and Client-side
export interface IUser {
  id?: string
  first_name: string
  last_name: string
}

export class User extends Eloquent.Mongoose<IUser, User>() {
  static className: string = 'User'

  getClassName() {
    return User.className
  }

  getSchema() {
    return new Schema({
      first_name: { type: String },
      last_name: { type: String }
    })
  }
}
```

## II. Querying

### Retrieve models

```typescript
async function getAll() {
  const users: Collection<User> = await User.get()
}
```

### Find one model

```typescript
async function findByPrimaryKey() {
  const users: User = await User.orderBy('age', 'desc').find()
}
```

### Find a model by primary key

```typescript
async function findByPrimaryKey() {
  const users: User = await User.find('0000000000000000000000000000')
}
```

### Count

```typescript
async function count() {
  const count: number = await User.count()
}
```

### Pluck

```typescript
const data: Object = await User.pluck('first_name') // -> { [id]: first_name, ... }
const hash: Object = await User.pluck('first_name', 'age') // -> { [age]: first_name, ... }
```

### Select Specific Columns

```typescript
const data: number = await User.select('first_name').get() // -> Collection({ first_name: value }, ...)
```

### Query Builder

```typescript
async function customQuery() {
  return await User.queryName('Your custom query')
    .where('first_name', 'tony')
    .where('age', '>', 10)
    .get()
}
```

#### Operators

##### Not Equal: `!=` or `<>`

```typescript
await User.where('first_name', '!=', 'tony').get() // -> { first_name: { $ne: 'tony' } }
```

##### Less than: `<`

```typescript
await User.where('age', '<', 20).get() // -> { age: { $lt: 20 } }
```

##### Less than or equal: `<=` or `=<`

```typescript
await User.where('age', '<=', 20).get() // -> { age: { $lte: 20 } }
```

##### Greater than or equal: `>=` or `=>`

```typescript
await User.where('age', '>=', 20).get() // -> { age: { $gte: 20 } }
```

##### Greater than: `>`

```typescript
await User.where('age', '>', 20).get() // -> { age: { $gt: 20 } }
```

##### Finding a value in an array

```typescript
// Using .whereIn()
return await User.whereIn('first_name', ['tony']).get() // -> { first_name: { $in: ['tony'] } }

// Using .where() with operator 'in'
return await User.where('first_name', 'in', ['tony']).get() // -> { first_name: { $in: ['tony'] } }
```

##### Finding a value NOT in an array

```typescript
// Using .whereIn()
await User.whereNotIn('first_name', ['tony']).get() // -> { first_name: { $nin: ['tony'] } }

// Using .where() with operator 'not-in'
await User.where('first_name', 'not-in', ['tony']).get() // -> { first_name: { $nin: ['tony'] } }
```

#### AND conditions

```typescript
User.where('first_name', 'tony')
  .where('last_name', 'stark')
  .get() // -> { first_name: 'tony', last_name: 'stark' }

// Using .where() with operator 'not'
await User.where('first_name', 'tony')
  .where('last_name', '!=', 'stark')
  .get() // -> { first_name: 'tony', last_name: { $ne: 'stark' } }
```

#### OR conditions

```typescript
User.where('first_name', 'tony')
  .orWhere('last_name', 'stark')
  .get() // -> { $or: [ { first_name: 'tony' }, { last_name: 'stark' }] }

// Using .where() with operator 'not-in'
await User.where('first_name', 'tony')
  .where('last_name', 'stark')
  .orWhere('age', 40)
  .get() // -> { first_name: 'tony', $or: [ { last_name: 'stark' }, { age: 40 }] }

await User.queryName('(A and B) or (C and D)')
  .where(function(query) {
    return query.where('first_name', 'tony').where('last_name', 'stark')
  })
  .orWhere(function(query) {
    return query.where('age', '<', 20).where('age', '>', 40)
  })
  .get()
// ->
// {
//   $or: [
//     { first_name: 'tony', last_name: 'stark' },
//     { $and: [ { age: { $lt: 20} }, { age: { $gt: 40 } } ] }
//   ]
// }
```

#### Using Mongoose

```typescript
// Build native query from model
User.native(function(model) {
  return model.find({
    first_name: 'tony'
  })
}).get()

// Continue build query by native mongoose
User.where('first_name', 'tony')
  .native(function(query) {
    return query.populate('roles')
  })
  .get()
```

## III. ActiveRecord - Create, Update & Delete

### Creating A New Model

```typescript
// create model with data
const user = new User({
  first_name: 'tony',
  last_name: 'stark'
})
await user.save()

// create model without data
const user = new User()
user.first_name = 'tony'
user.last_name: 'stark'
await user.save()
```

### Updating Models

```typescript
// create model without data
const user = await User.orderBy('age').find()
user.first_name = 'tony'
user.last_name: 'stark'
await user.save()
```

### Deleting Models

```typescript
// create model without data
const user = await User.orderBy('age').find()
await user.delete()
```

## IV. Accessors and Mutators

### Accessor

You can define an accessor by `getter` or a function like Laravel Eloquent

```typescript
// file: Accessor.ts
export class User extends User.Class<IAdminUser, User>() {
  // For `node > 8.7` or whatever supports `Object.getOwnPropertyDescriptor`
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

### Mutator

You can define a mutator by `setter` or a function like Laravel Eloquent

```typescript
// file: Mutator.ts
export class User extends User.Class<IAdminUser, User>() {
  // For `node > 8.7` or whatever supports `Object.getOwnPropertyDescriptor`
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

## IV. Timestamps

You can simply define timestamps for models by changing static variable named `timestamps`

```typescript
// file: Timestamps.ts
export class User extends User.Class<IAdminUser, User>() {
  static timestamps = true
}
```

By default, Najs will create 2 fields named `created_at` and `updated_at`, you can custom the fields' name:

```typescript
// file: Timestamps.ts
export class User extends User.Class<IAdminUser, User>() {
  static timestamps = { createdAt: 'created', updatedAt: 'updated' }
}
```

Najs gets now value from `Moment` so if you can do this way to provide specific date in tests:

```typescript
// file: Test.ts
const Model = require('moment')

export class User extends User.Class<IAdminUser, User>() {
  static timestamps = { createdAt: 'created', updatedAt: 'updated' }
}

describe('Custom now value', function() {
  it('comes in handy', function() {
    const now = new Date(1999, 0, 1)
    Moment.now = () => now

    const user = new User()
    await user.save()

    console.log(user.created_at) // -> 01/01/1999
    console.log(user.updated_at) // -> 01/01/1999
  })
})
```

## V. Soft Deletes

You can simply define soft deletes for models by changing static variable named `softDeletes`

```typescript
// file: SoftDelete.ts
export class User extends User.Class<IAdminUser, User>() {
  static softDeletes = true
}
```

By default, Najs will create 1 field named `deleted_at` with value is `null` when document is not deleted and contains `Date` when it was deleted. You can custom the field's name

```typescript
// file: SoftDelete.ts
export class User extends User.Class<IAdminUser, User>() {
  static softDeletes = { deletedAt: 'deleteAt' }
}
```

You can query the trashed documents just like laravel

```typescript
User.queryName('Select un-deleted document only')
  .where('first_name', 'john')
  .get() // -> return all john which are not deleted

User.queryName('Select all documents, including deleted')
  .withTrashed()
  .where('first_name', 'john')
  .get() // -> return all john including deleted ones

User.queryName('Select deleted documents only')
  .onlyTrashed()
  .where('first_name', 'john')
  .get() // -> return all john which are deleted
```

The `withTrashed` or `onlyTrashed` can be used after the `where` or any query statements, for example

```typescript
User.select('last_name')
  .withTrashed()
  .get()

User.limit(10)
  .where('age' > 10)
  .onlyTrashed()
  .find()
```

Like `timestamp` above, Najs gets now value from `Moment`

```typescript
// file: Test.ts
const Model = require('moment')

export class User extends User.Class<IAdminUser, User>() {
  static timestamps = true
  static softDeletes = true
}

describe('Custom now value', function() {
  it('comes in handy', function() {
    let now = new Date(1999, 0, 1)
    Moment.now = () => now

    const user = new User()
    await user.save()

    console.log(user.created_at) // -> 01/01/1999
    console.log(user.updated_at) // -> 01/01/1999

    now = new Date(2010, 0, 1)
    Moment.now = () => now
    await user.delete()

    console.log(user.deleted_at) // -> 01/01/2010
  })
})
```

## VI. Inheritance

If you want to extend models, just use `[ParentModel].Class()` instead of `Eloquent.Mongoose()`

```typescript
// file: AdminUser.ts
import { User } from 'najs-eloquent'

// This interface can be shared between Server-side and Client-side
export interface IAdminUser {
  id?: string
  is_admin: true
}

export class AdminUser extends User.Class<IAdminUser, User>() {
  static className: string = 'AdminUser'

  // using the same collection as User model
  getModelName() {
    return super.getModelName()
  }

  getClassName() {
    return AdminUser.className
  }

  getSchema() {
    const schema = super.getSchema()
    schema.add({
      is_admin: { type: Boolean }
    })
    return schema
  }
}
```

## VII. Put them all together in Repository

You can create Repository for models with very _najs_ and clear syntax

```typescript
// file: UserRepository.ts
import { User } from './User'
import { Collection } from 'collect.js'

class UserRepository {
  async createUser(firstName: string, lastName: string): Promise<User> {
    const user = new User({
      first_name: firstName,
      last_name: lastName
    })
    await user.save()
    return user
  }

  async updateUser(id: string, firstName: string, lastName: string): Promise<User> {
    const user = await User.find(id)
    user.first_name = firstName
    user.last_name = lastName
    await user.save()
    return user
  }

  async deleteUser(firstName: string, lastName: string): Promise<any> {
    return User.queryName('delete user by first name and last name')
      .where('first_name', firstName)
      .where('last_name', lastName)
      .delete()
  }

  async getAllUsers(): Promise<Collection<User>> {
    // Using custom static function
    return User.getAllUsers()
  }

  async getUserByFirstName(firstName: string): Promise<Collection<User>> {
    return User.where('first_name', firstName).get()
  }

  async findUser(id: string): Promise<User | undefined> {
    return User.find(id)
  }
}
```

# Versioning and Road map

* `0.1.x` [Released] - Basic features of Eloquent, targeted to mongodb only
* `0.2.x` [Released] - Advance features of Eloquent, accessor, mutator, `timestamps` and `soft-delete` queries
* `0.3.x` [In Progress] - Support full static helper functions of Eloquent such as `findOrFail`, `paginate`, `chunk`

I'm gonna take a break and use `0.3.x` in real world. With node applications, the stuff below seems not so important, doesn't it?

* `0.4.x` [Todo] - Introduce migration strategy for Mongodb. This is not so important
* `0.5.x` [Todo] - Use knex as a query builder, targeted to RDB such as `MySQL`, `SqlLite` without transaction
* `0.6.x` [Todo] - Introduce Eloquent scope and relationship
* `0.7.x` [Todo] - Support RDB transactional query
* `0.8.x` [Todo] - Introduce migration for RDB
* `0.9.x` [Todo] - Support other kinds of db requested by community

# Contribute

PRs are welcomed to this project, and help is needed in order to keep up with the changes of Laravel Eloquent. If you want to improve the library, add functionality or improve the docs please feel free to submit a PR.

# Sponsors

If you want to become a sponsor please [let me know](mailto:nhat@ntworld.net).

You can buy me a beer via [Paypal](https://paypal.me/beerfornhat) or [Patreon](https://patreon.com/nhat).

Thanks in advance!

# License

MIT © Nhat Phan
