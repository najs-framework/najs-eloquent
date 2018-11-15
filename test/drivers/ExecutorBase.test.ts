import 'jest'
import { ExecutorBase } from '../../lib/drivers/ExecutorBase'

describe('ExecutorBase', function() {
  describe('.setExecuteMode()', function() {
    it('is chainable, can set executeMode to default or disabled', function() {
      const executor = new ExecutorBase()
      expect(executor.setExecuteMode('default') === executor).toBe(true)
      expect(executor.shouldExecute()).toBe(true)
      expect(executor.setExecuteMode('disabled') === executor).toBe(true)
      expect(executor.shouldExecute()).toBe(false)
    })
  })

  describe('.shouldExecute()', function() {
    it('returns false if executeMode is disabled', function() {
      const executor = new ExecutorBase()
      expect(executor.setExecuteMode('default') === executor).toBe(true)
      expect(executor.shouldExecute()).toBe(true)
      expect(executor.setExecuteMode('disabled') === executor).toBe(true)
      expect(executor.shouldExecute()).toBe(false)
    })
  })
})
