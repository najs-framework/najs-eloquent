import 'jest'
import * as Sinon from 'sinon'
import { ExecuteQuery } from '../../../lib/query-builders/mixin/ExecuteQuery'
import { isPromise } from '../../../lib/util/isPromise'

describe('ExecuteQuery', function() {
  const functions = ['count', 'update', 'delete', 'restore', 'execute']

  for (const func of functions) {
    describe(`.${func}()`, function() {
      it(`calls and returns to handler.getQueryExecutor().${func}()`, async function() {
        const result = {}
        const queryExecutor = {
          [func]: async function() {
            return result
          }
        }
        const handler = {
          getQueryExecutor() {
            return queryExecutor
          }
        }

        const spy = Sinon.spy(queryExecutor, func)

        const queryBuilder = {
          handler: handler
        }

        const callResult = ExecuteQuery[func].call(queryBuilder)
        expect(isPromise(callResult)).toBe(true)
        expect((await callResult) === result).toBe(true)
        expect(spy.calledWith()).toBe(true)
      })
    })
  }
})
