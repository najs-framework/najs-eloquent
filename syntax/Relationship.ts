class Comment {
  post?: Post

  postRelationship(): any {
    // return belongsTo('Post')
  }
}

type Relation = {
  getRelationship(): any
}

class Post {
  comments: (Comment[] | undefined) & Relation = this.hasMany('Comment')

  commentsRelationship(): any {
    // return hasMany('Comment')
  }

  hasMany(table: string): any {}

  relationship(relation: any): any {}
}

async function relation_test() {
  const post = new Post()

  if (!post.comments) {
    await post
      .commentsRelationship()
      .where('title', 'like', '%Test%')
      .get()
  }

  await post.comments
    .getRelationship()
    .where('title')
    .get()

  post.relationship(post.comments)
}
