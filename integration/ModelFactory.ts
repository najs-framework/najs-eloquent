import { Factory, Faker } from '../dist/lib/v1'
import { User } from './models/User'
import { Post } from './models/Post'
import { ObjectId } from 'bson'

function createObjectId(): string {
  return new ObjectId().toHexString()
}

Factory.define(User.className, (faker: Faker, attributes?: Object): Object => {
  return Object.assign(
    {
      email: faker.email(),
      first_name: faker.first(),
      last_name: faker.last(),
      age: faker.age()
    },
    attributes
  )
})

Factory.define(Post.className, (faker: Faker, attributes?: Object): Object => {
  return Object.assign(
    {
      user_id: createObjectId(),
      title: faker.sentence(),
      content: faker.paragraph(),
      view: faker.natural()
    },
    attributes
  )
})
