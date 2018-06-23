import * as Knex from 'knex'
import { KnexProvider } from './../facades/global/KnexProviderFacade'

// export class Database {
//   protected knex: Knex

//   constructor() {
//     this.knex = KnexProvider.setDefaultConfig({ client: 'mysql' }).create()

//     // this.knex.orWhereNot('test')
//     // this.knex
//   }
// }

export const DB: Knex = <any>new Proxy(
  {},
  {
    get(target, key) {
      if (typeof target['knex'] === 'undefined') {
        target['knex'] = KnexProvider.create()
      }
      return target['knex'][key]
    }
  }
)
