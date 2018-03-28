import { Factory, Faker } from '../dist/lib/v1'
import { User } from './models/User'

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
