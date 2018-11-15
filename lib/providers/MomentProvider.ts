/// <reference path="../contracts/MomentProvider.ts" />

import { Moment } from 'moment'
import { register } from 'najs-binding'
import { Facade } from 'najs-facade'
import { NajsEloquent } from '../constants'

const moment = require('moment')

export class MomentProvider extends Facade implements Najs.Contracts.Eloquent.MomentProvider<Moment> {
  getClassName() {
    return NajsEloquent.Provider.MomentProvider
  }

  make(): Moment {
    return moment(...arguments)
  }

  isMoment(value: any): boolean {
    return moment.isMoment(value)
  }

  setNow(cb: () => any): this {
    moment.now = cb

    return this
  }
}
register(MomentProvider, NajsEloquent.Provider.MomentProvider)
