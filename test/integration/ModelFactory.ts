import { Factory, Faker } from '../../lib'
import { User } from './models/User'
import { Post } from './models/Post'
import { Comment } from './models/Comment'

Factory.define(
  User,
  (faker: Faker, attributes?: Object): Object => {
    return Object.assign(
      {
        email: faker.email(),
        first_name: faker.first(),
        last_name: faker.last(),
        age: faker.age()
      },
      attributes
    )
  }
)

Factory.define(
  Post,
  (faker: Faker, attributes?: Object): Object => {
    return Object.assign(
      {
        title: faker.sentence(),
        content: faker.paragraph(),
        view: faker.natural()
      },
      attributes
    )
  }
)

Factory.define(
  Comment,
  (faker: Faker, attributes?: Object): Object => {
    return Object.assign(
      {
        email: faker.email(),
        name: faker.name(),
        content: faker.paragraph(),
        like: faker.natural()
      },
      attributes
    )
  }
)
