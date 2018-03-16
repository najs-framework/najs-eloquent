import { EloquentSoftDelete } from '../EloquentMetadata'
import { Schema, Model } from 'mongoose'
import { isObject } from 'lodash'
import * as Moment from 'moment'

// tslint:disable-next-line
const NOT_DELETED_VALUE = null
const DEFAULT_OPTIONS: EloquentSoftDelete = { deletedAt: 'deleted_at', overrideMethods: false }

export function SoftDelete(schema: Schema, options: EloquentSoftDelete | boolean) {
  const opts: EloquentSoftDelete = isObject(options) ? Object.assign({}, DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS

  schema.add({
    [opts.deletedAt]: { type: Date, default: NOT_DELETED_VALUE }
  })

  if (opts.overrideMethods) {
    const overridableMethods: string[] = ['count', 'find', 'findOne']
    let finalList: string[] = []

    if (
      (typeof opts.overrideMethods === 'string' || opts.overrideMethods instanceof String) &&
      opts.overrideMethods === 'all'
    ) {
      finalList = overridableMethods
    }

    if (typeof opts.overrideMethods === 'boolean' && opts.overrideMethods === true) {
      finalList = overridableMethods
    }

    if (Array.isArray(opts.overrideMethods)) {
      opts.overrideMethods.forEach(function(method) {
        if (overridableMethods.indexOf(method) !== -1) {
          finalList.push(method)
        }
      })
    }

    finalList.forEach(function(method) {
      schema.statics[method] = function() {
        return Model[method]
          .apply(this, arguments)
          .where(opts.deletedAt)
          .equals(NOT_DELETED_VALUE)
      }
      schema.statics[method + 'OnlyDeleted'] = function() {
        return Model[method]
          .apply(this, arguments)
          .where(opts.deletedAt)
          .ne(NOT_DELETED_VALUE)
      }
      schema.statics[method + 'WithDeleted'] = function() {
        return Model[method].apply(this, arguments)
      }
    })
  }

  schema.methods.delete = function(...args: any[]) {
    this[opts.deletedAt] = Moment().toDate()
    return this.save(...args)
  }

  schema.methods.restore = function(callback: any) {
    this[opts.deletedAt] = NOT_DELETED_VALUE
    return this.save(callback)
  }
}
