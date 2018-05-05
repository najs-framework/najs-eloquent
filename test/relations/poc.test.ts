import 'jest'
describe('Relation PoC', function() {
  it.skip('first proposal', async function() {
    // The first proposal: integrate model + relationship
    // Pros:
    //  - can use relation data without null/undefined typed warning
    //  - the relation automatically linked to container model
    // Cons:
    //  - confuse and have to check isLoaded() in case it was not loaded
    //  - Only throws warning in running time in case the relation is not loaded but used
    const user: any = {}

    // fill relationship
    await user.phone.fill({}).save()

    for (const post of user.posts) {
      post.doSomething()
    }

    if (!user.phone.isLoaded()) {
      await user.phone.load()
    } else {
      // should display warning
      user.phone.country
    }

    // Eager load
    await user.with('phone').where('any').get

    // Linked and query through relation
    user.phone
      .getRelation()
      .where('country', 'us')
      .first()
  })

  it.skip('second proposal', function() {
    // The second proposal: separated model + relationship
    // Pros:
    //  - relationship data is nullable, can use with if() easier
    //  - clear syntax when working with relationship
    //  - the syntax looks like Laravel
    //  - easier to implement
    // Cons:
    //  - usage in model is more complicated
    //  - customer could be confused regard relation and relation's data

    interface HasMany {
      [Symbol.iterator]: (() => any)

      length: number

      attach(): void

      getData(): this | null
    }

    class AdvancedType {
      postsRelation(): HasMany {
        return <any>[]
      }

      get posts(): HasMany | null {
        return this.postsRelation().getData()
      }
    }

    const instance = new AdvancedType()
    for (const name of instance.posts!) {
      console.log(name)
    }

    // working with relationship
    instance.postsRelation().attach()
  })
})
