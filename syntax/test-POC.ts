import { Eloquent, WithStatic, EloquentMongoose } from './def-POC'

interface IModel {
  member: string
}

class Model extends Eloquent.Mongoose<IModel>() implements IModel {
  member: string
}

const first = Model.first()
first.member = 'test'
first.method()

class Post extends (EloquentMongoose as WithStatic<IModel>) {
  static firstPost(): Post {
    return <any>{}
  }

  static allPosts(): Post[] {
    return []
  }
}

Post.allPosts()

Post.firstPost().member = 'test'
Post.firstPost().method()

const post = new Post()
post.member = 'test'
post.method()

const firstPost = Post.first()
firstPost.member = 'test'
firstPost.method()

class User extends EloquentMongoose implements IModel {
  member: string
}

const userInstance = new User()
userInstance.first().member
userInstance.member = 'test'
userInstance.method()
