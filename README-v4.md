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

If you are Laravel Eloquent lover and want to use it in `Node JS` you will love `Najs Eloquent`. `Najs Eloquent` is
Laravel Eloquent, written in `Typescript` (with some helpers you can use it in Javascript for sure).

You can take a look on [full documentation and usage](https://najs-framework.github.io/docs/najs-eloquent/getting-started/) or setup example in [najs-eloquent-example](https://github.com/najs-framework/najs-eloquent-example) repository.

# Installation

Add `najs-binding`, `najs-eloquent`

```bash
yarn add najs-binding najs-eloquent
```

or

```bash
npm install najs-binding najs-eloquent
```

NajsEloquent runs with Memory driver by default that means all data is saved in memory. There are some available drivers that you can use

- mongodb
- mongoose

That's it.

# Quick Usage

## I. Defining Models

## II. Querying

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
user.last_name = 'stark'
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

### Mutator

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

## IV. Timestamps

You can simply define timestamps for models by changing static variable named `timestamps`

```typescript
// file: Timestamps.ts
import { Model } from 'najs-eloquent'

export class User extends Model {
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
import { Model, MomentProvider } from 'najs-eloquent'

export class User extends User.Class<IAdminUser, User>() {
  static timestamps = { createdAt: 'created', updatedAt: 'updated' }
}

describe('Custom now value', function() {
  it('comes in handy', function() {
    const now = new Date(1999, 0, 1)
    MomentProvider.setNow(() => now)

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

# Contribute

PRs are welcomed to this project, and help is needed in order to keep up with the changes of Laravel Eloquent. If you want to improve the library, add functionality or improve the docs please feel free to submit a PR.

# Sponsors

If you want to become a sponsor please [let me know](mailto:nhat@ntworld.net).

You can buy me a beer via [Paypal](https://paypal.me/beerfornhat) or [Patreon](https://patreon.com/nhat).

Thanks in advance!

# License

MIT © Nhat Phan
