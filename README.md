# Najs Eloquent

[![Travis](https://img.shields.io/travis/najs-framework/najs-eloquent/master.svg?style=flat-square)](https://travis-ci.org/najs-framework/najs-eloquent/builds)
[![Coverage Status](https://img.shields.io/coveralls/najs-framework/najs-eloquent/master.svg?style=flat-square)](https://coveralls.io/r/najs-framework/najs-eloquent?branch=master)
[![npm version](https://img.shields.io/npm/v/najs-eloquent.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![npm downloads](https://img.shields.io/npm/dm/najs-eloquent.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![npm license](https://img.shields.io/npm/l/najs-eloquent.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

If you are Laravel Eloquent lover and want to use it in Node JS you will love Najs Eloquent. Najs Eloquent is Laravel
Eloquent, written in Typescript (with some helpers you can use it with Javascript for sure).

Current version - `0.1.5` - is targeted to Mongodb only (using Mongoose as backer ORM). Because MongoDB is not RDB then
some features of Laravel Eloquent are cut off such as relationship, scope. In the way to `1.0.0`, the `Najs Eloquent`
will support full Eloquent feature with difference db like `MySql`, `PostgreSQL` or `SqlLite` (use `knex` as query
builder).

# Versioning and Road map

* `0.1.x` [Released] - Basic feature of Eloquent, targeted to mongodb only
* `0.2.x` [In Progress] - Advance feature of Eloquent, accessor, mutator, `timestamps` and `soft-delete` queries
* `0.3.x` [Todo] - Support full static helper functions of Eloquent such as `findOrFail`, `paginate`, `chunk`
* `0.4.x` [Todo] - Introducing migration strategy for Mongodb
* `0.5.x` [Todo] - Use knex as a query builder, targeted to RDB such as `MySQL`, `SqlLite` without transaction
* `0.6.x` [Todo] - Introducing Eloquent scope and relationship
* `0.7.x` [Todo] - Support RDB transactional query
* `0.8.x` [Todo] - Introducing migration for RDB
* `0.9.x` [Todo] - Support other kind of db which requested by community

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

You can use another class but is must be implements IMongooseProvider and register under "**MongooseProvider**" name,
for example

```typescript
// file: CustomMongooseProviderName.ts
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

### Counting

```typescript
async function count() {
  const count: number = await User.count()
}
```

### Pluck-ing

```typescript
const data: Object = await User.pluck('first_name') // -> { [id]: first_name, ... }
const hash: Object = await User.pluck('first_name', 'age') // -> { [age]: first_name, ... }
```

### Selecting Specific Columns

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

// Using .where() with operator 'not-in'
await User.where('first_name', 'tony')
  .where('last_name', '!=', 'stark')
  .get() // -> { first_name: 'tony', last_name: { $not: 'stark' } }
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

_Not available util 0.2.x_

## IV. Inheritance

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

## V. Put it all together in Repository

You can create Repository for models with very "najs" and clear syntax

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

# Contribute

PRs are welcomed to this project, and help is needed in order to keep up with the changes of Laravel Eloquent. If you want to improve the library, add functionality or improve the docs please feel free to submit a PR.

# Sponsors

If you want to become a sponsor please [let me know](mailto:nhat@ntworld.net).

You can buy me a beer via [Paypal](https://paypal.me/beerfornhat) or [Patreon](https://patreon.com/nhat).

Thanks in advance!

# License

MIT © Nhat Phan
