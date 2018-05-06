"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Eloquent_1 = require("../../lib/model/Eloquent");
const DummyDriver_1 = require("../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const najs_binding_1 = require("najs-binding");
EloquentDriverProviderFacade_1.EloquentDriverProviderFacade.register(DummyDriver_1.DummyDriver, 'dummy', true);
describe('Relation PoC', function () {
    it.skip('first proposal', async function () {
        // The first proposal: integrate model + relationship
        // Pros:
        //  - can use relation data without null/undefined typed warning
        //  - the relation automatically linked to container model
        // Cons:
        //  - confuse and have to check isLoaded() in case it was not loaded
        //  - Only throws warning in running time in case the relation is not loaded but used
        const user = {};
        // fill relationship
        await user.phone.fill({}).save();
        for (const post of user.posts) {
            post.doSomething();
        }
        if (!user.phone.isLoaded()) {
            await user.phone.load();
        }
        else {
            // should display warning
            user.phone.country;
        }
        // Eager load
        await user.with('phone').where('any').get;
        // Linked and query through relation
        user.phone
            .getRelation()
            .where('country', 'us')
            .first();
    });
    it.skip('second proposal', function () {
        // The second proposal: separated model + relationship
        // Pros:
        //  - relationship data is nullable, can use with if() easier
        //  - clear syntax when working with relationship
        //  - the syntax looks like Laravel
        //  - easier to implement
        // Cons:
        //  - usage in model is more complicated
        //  - customer could be confused regard relation and relation's data
        class AdvancedType {
            postsRelation() {
                return [];
            }
            get posts() {
                return this.postsRelation().getData();
            }
        }
        const instance = new AdvancedType();
        for (const name of instance.posts) {
            console.log(name);
        }
        // working with relationship
        instance.postsRelation().attach();
    });
    it('define relation', function () {
        class Relation {
        }
        class User extends Eloquent_1.Eloquent {
            getPostRelation() {
                return this.defineRelationProperty('post').hasOne();
            }
            defineRelationProperty(name) {
                if (!this['relations']) {
                    this['relations'] = {};
                }
                this['relations'][name] = 'defined';
                return this;
            }
            hasOne() {
                return new Relation();
            }
        }
        User.className = 'User';
        najs_binding_1.register(User);
        // class DefineRelationPropertyTracker {
        //   sample: Object
        //   name: string
        //   start: boolean
        //   constructor(sample: Object, name: string) {
        //     this.sample = sample
        //     this.name = name
        //     this.start = false
        //   }
        //   getDefinedName() {
        //     const proxy = new Proxy(this.sample, {
        //       get: (target, key) => {
        //         console.log(key)
        //         if (key === this.name) {
        //           this.start = true
        //           return target[this.name]
        //         }
        //         console.log(this.start)
        //         if (this.start && typeof target[key] === 'function') {
        //           return function(this: any) {
        //             // const result = target[key].apply(this, arguments)
        //             // console.log(result)
        //             console.log(arguments)
        //             // return result
        //           }
        //         }
        //         return target[this.name]
        //       }
        //     })
        //     // fake calls
        //     console.log(proxy[this.name].call(proxy))
        //   }
        // }
        const user = new User();
        const prototype = User.prototype;
        const descriptors = Object.getOwnPropertyDescriptors(prototype);
        for (const name in descriptors) {
            if (name === 'constructor' || name === 'hasOne') {
                continue;
            }
            const descriptor = descriptors[name];
            if (typeof descriptor.value === 'function') {
                const value = descriptor.value.call(user);
                if (value instanceof Relation) {
                    const freshInstance = user.newInstance();
                    freshInstance[name]();
                    console.log(Object.getOwnPropertyNames(freshInstance['relations']));
                    // const tracker = new DefineRelationPropertyTracker(user, name)
                    // tracker.getDefinedName()
                }
            }
        }
        // user.post!.title
    });
});
