/**
 * This file is copied from Schema.prototype.setupTimestamp of mongoose, and use Moment to replace new Date()
 *
 * original file: https://github.com/Automattic/mongoose/blob/master/lib/schema.js
 *
 * NOTE: this file will not be included in coverage report.
 */

const Moment = require('moment')

/**
 * Setup updatedAt and createdAt timestamps to documents if enabled
 *
 * @param {Boolean|Object} timestamps timestamps options
 * @api private
 */
module.exports.setupTimestamp = function(timestamps) {
  if (timestamps) {
    var paths = ['createdAt', 'updatedAt'].map(handleTimestampOption.bind(null, timestamps))
    var createdAt = paths[0]
    var updatedAt = paths[1]
    var schemaAdditions = paths.reduce(
      function(cur, path) {
        if (path != null) {
          var parts = path.split('.')
          if (this.pathType(path) === 'adhocOrUndefined') {
            for (var i = 0; i < parts.length; ++i) {
              cur[parts[i]] = i < parts.length - 1 ? cur[parts[i]] || {} : Date
            }
          }
        }
        return cur
      }.bind(this),
      {}
    )

    this.add(schemaAdditions)

    this.pre('save', function(next) {
      var defaultTimestamp = Moment().toDate()
      var auto_id = this._id && this._id.auto

      if (createdAt != null && !this.get(createdAt) && this.isSelected(createdAt)) {
        this.set(createdAt, auto_id ? this._id.getTimestamp() : defaultTimestamp)
      }

      if (updatedAt != null && (this.isNew || this.isModified())) {
        var ts = defaultTimestamp
        if (this.isNew) {
          if (createdAt != null) {
            ts = this.get(createdAt)
          } else if (auto_id) {
            ts = this._id.getTimestamp()
          }
        }
        this.set(updatedAt, ts)
      }

      next()
    })

    var genUpdates = function(currentUpdate, overwrite) {
      var now = Moment().toDate()
      var updates = {}
      var _updates = updates
      if (overwrite) {
        if (currentUpdate && currentUpdate.$set) {
          currentUpdate = currentUpdate.$set
          updates.$set = {}
          _updates = updates.$set
        }
        if (updatedAt != null && !currentUpdate[updatedAt]) {
          _updates[updatedAt] = now
        }
        if (createdAt != null && !currentUpdate[createdAt]) {
          _updates[createdAt] = now
        }
        return updates
      }
      updates = { $set: {} }
      currentUpdate = currentUpdate || {}

      if (updatedAt != null && (!currentUpdate.$currentDate || !currentUpdate.$currentDate[updatedAt])) {
        updates.$set[updatedAt] = now
      }

      if (createdAt != null) {
        if (currentUpdate[createdAt]) {
          delete currentUpdate[createdAt]
        }
        if (currentUpdate.$set && currentUpdate.$set[createdAt]) {
          delete currentUpdate.$set[createdAt]
        }

        updates.$setOnInsert = {}
        updates.$setOnInsert[createdAt] = now
      }

      return updates
    }

    this.methods.initializeTimestamps = function() {
      if (!this.get(createdAt)) {
        this.set(createdAt, Moment().toDate())
      }
      if (!this.get(updatedAt)) {
        this.set(updatedAt, Moment().toDate())
      }
      return this
    }

    this.pre('findOneAndUpdate', function(next) {
      var overwrite = this.options.overwrite
      this.findOneAndUpdate({}, genUpdates(this.getUpdate(), overwrite), {
        overwrite: overwrite
      })
      applyTimestampsToChildren(this)
      next()
    })

    this.pre('update', function(next) {
      var overwrite = this.options.overwrite
      this.update({}, genUpdates(this.getUpdate(), overwrite), {
        overwrite: overwrite
      })
      applyTimestampsToChildren(this)
      next()
    })
  }
}

/*!
 * ignore
 */

function handleTimestampOption(arg, prop) {
  if (typeof arg === 'boolean') {
    return prop
  }
  if (typeof arg[prop] === 'boolean') {
    return arg[prop] ? prop : null
  }
  if (!(prop in arg)) {
    return prop
  }
  return arg[prop]
}

/*!
 * ignore
 */

function applyTimestampsToChildren(query) {
  var now = Moment().toDate()
  var update = query.getUpdate()
  var keys = Object.keys(update)
  var key
  var schema = query.model.schema
  var len
  var createdAt
  var updatedAt
  var timestamps
  var path

  var hasDollarKey = keys.length && keys[0].charAt(0) === '$'

  if (hasDollarKey) {
    if (update.$push) {
      for (key in update.$push) {
        var $path = schema.path(key)
        if (update.$push[key] && $path && $path.$isMongooseDocumentArray && $path.schema.options.timestamps) {
          timestamps = $path.schema.options.timestamps
          createdAt = handleTimestampOption(timestamps, 'createdAt')
          updatedAt = handleTimestampOption(timestamps, 'updatedAt')
          if (update.$push[key].$each) {
            update.$push[key].$each.forEach(function(subdoc) {
              if (updatedAt != null) {
                subdoc[updatedAt] = now
              }
              if (createdAt != null) {
                subdoc[createdAt] = now
              }
            })
          } else {
            if (updatedAt != null) {
              update.$push[key][updatedAt] = now
            }
            if (createdAt != null) {
              update.$push[key][createdAt] = now
            }
          }
        }
      }
    }
    if (update.$set) {
      for (key in update.$set) {
        path = schema.path(key)
        if (!path) {
          continue
        }
        if (Array.isArray(update.$set[key]) && path.$isMongooseDocumentArray) {
          len = update.$set[key].length
          timestamps = schema.path(key).schema.options.timestamps
          if (timestamps) {
            createdAt = handleTimestampOption(timestamps, 'createdAt')
            updatedAt = handleTimestampOption(timestamps, 'updatedAt')
            for (var i = 0; i < len; ++i) {
              if (updatedAt != null) {
                update.$set[key][i][updatedAt] = now
              }
              if (createdAt != null) {
                update.$set[key][i][createdAt] = now
              }
            }
          }
        } else if (update.$set[key] && path.$isSingleNested) {
          timestamps = schema.path(key).schema.options.timestamps
          if (timestamps) {
            createdAt = handleTimestampOption(timestamps, 'createdAt')
            updatedAt = handleTimestampOption(timestamps, 'updatedAt')
            if (updatedAt != null) {
              update.$set[key][updatedAt] = now
            }
            if (createdAt != null) {
              update.$set[key][createdAt] = now
            }
          }
        }
      }
    }
  }
}
