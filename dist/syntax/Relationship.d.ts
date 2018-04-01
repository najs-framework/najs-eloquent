declare class Comment {
    post?: Post;
    postRelationship(): any;
}
declare type Relation = {
    getRelationship(): any;
};
declare class Post {
    comments: (Comment[] | undefined) & Relation;
    commentsRelationship(): any;
    hasMany(table: string): any;
    relationship(relation: any): any;
}
declare function relation_test(): Promise<void>;
