class HasManyRelationship {
    constructor(value) {
        this.value = value;
    }
    getValue() {
        return 'test';
    }
}
const SmartProxy = {
    get: function (target, key) {
        console.log('get', key);
        if (target[key] instanceof HasManyRelationship) {
            if (!target['loaded'] || !target['loaded'][key]) {
                return undefined;
            }
            return target[key];
        }
        return target[key];
    },
    set: function (target, key, value) {
        console.log('set', arguments);
        target[key] = value;
        return true;
    }
};
class PostModel {
    constructor() {
        this.comments = this.hasMany();
        this.loaded = {};
        return new Proxy(this, SmartProxy);
    }
    hasMany() {
        return new HasManyRelationship();
    }
    setLoaded(relationship) {
        this.loaded[relationship] = true;
    }
    getComments() {
        this.loaded = true;
    }
}
const notLoaded = new PostModel();
if (notLoaded.comments) {
    console.log('if (notLoaded.comments) returns true');
}
else {
    console.log('if (notLoaded.comments) returns false');
}
const loaded = new PostModel();
loaded.setLoaded('comments');
if (loaded.comments) {
    console.log('if (loaded) returns true');
}
else {
    console.log('if (loaded) returns false');
}
if (!loaded.comments) {
    loaded.comments = loaded.getComments();
}
loaded.comments && loaded.comments.getValue();
// console.log(loaded.comments.getValue())
// console.log(notLoaded.comments.getValue())
