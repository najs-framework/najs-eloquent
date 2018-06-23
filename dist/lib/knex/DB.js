"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KnexProviderFacade_1 = require("./../facades/global/KnexProviderFacade");
// export class Database {
//   protected knex: Knex
//   constructor() {
//     this.knex = KnexProvider.setDefaultConfig({ client: 'mysql' }).create()
//     // this.knex.orWhereNot('test')
//     // this.knex
//   }
// }
exports.DB = new Proxy({}, {
    get(target, key) {
        if (typeof target['knex'] === 'undefined') {
            target['knex'] = KnexProviderFacade_1.KnexProvider.create();
        }
        return target['knex'][key];
    }
});
