import 'jest'
import { PrototypeManager } from '../../lib/util/PrototypeManager'

describe('PrototypeManager', function() {
  const a = {}
  const b = {}

  describe('.shouldFindRelationsIn()', function() {
    it('finds and returns false if the prototype is in "stopFindingRelationsPrototypes"', function() {
      PrototypeManager.stopFindingRelationsIn(a)
      expect(PrototypeManager.shouldFindRelationsIn(a)).toBe(false)
      expect(PrototypeManager.shouldFindRelationsIn(b)).toBe(true)
    })
  })

  describe('.stopFindingRelationsIn()', function() {
    it('adds to "stopFindingRelationsPrototypes" in case .shouldFindRelationsIn() returns true', function() {
      const length = PrototypeManager.stopFindingRelationsPrototypes.length

      PrototypeManager.stopFindingRelationsIn(a)
      expect(PrototypeManager.stopFindingRelationsPrototypes.length).toEqual(length)

      expect(PrototypeManager.shouldFindRelationsIn(b)).toBe(true)
      PrototypeManager.stopFindingRelationsIn(b)
      expect(PrototypeManager.shouldFindRelationsIn(b)).toBe(false)
      expect(PrototypeManager.stopFindingRelationsPrototypes.length).toEqual(length + 1)
    })
  })
})
