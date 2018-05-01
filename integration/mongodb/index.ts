import '../ModelFactory'
import { Eloquent, MongooseDriver, EloquentDriverProvider, MongooseProvider } from '../../dist/lib'
import { IUser, User } from '../models/User'
import { IPost, Post } from '../models/Post'
import { IComment, Comment } from '../models/Comment'

EloquentDriverProvider.register(MongooseDriver, 'mongoose', true)

Eloquent.register(User)
Eloquent.register(Post)

export { IUser, User }
export { IPost, Post }
export { IComment, Comment }

export function init_mongoose(name: string): Promise<any> {
  return new Promise(resolve => {
    const mongoose = MongooseProvider.getMongooseInstance()
    mongoose.connect('mongodb://localhost/najs_eloquent_test_' + name)
    mongoose.Promise = global.Promise
    mongoose.connection.once('open', () => {
      resolve(true)
    })
  })
}

export function delete_collection(collections: string[]): Promise<any> {
  return new Promise(resolve => {
    for (const collection of collections) {
      MongooseProvider.getMongooseInstance()
        .connection.collection(collection)
        .drop(resolve)
    }
  })
}
