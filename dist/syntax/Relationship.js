class Comment {
    postRelationship() {
        // return belongsTo('Post')
    }
}
class Post {
    constructor() {
        this.comments = this.hasMany('Comment');
    }
    commentsRelationship() {
        // return hasMany('Comment')
    }
    hasMany(table) { }
    relationship(relation) { }
}
async function relation_test() {
    const post = new Post();
    if (!post.comments) {
        await post
            .commentsRelationship()
            .where('title', 'like', '%Test%')
            .get();
    }
    await post.comments
        .getRelationship()
        .where('title')
        .get();
    post.relationship(post.comments);
}
